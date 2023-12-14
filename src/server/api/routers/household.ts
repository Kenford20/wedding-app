import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { type Invitation } from '~/types/schema';

export const householdRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        guestParty: z.array(
          z.object({
            firstName: z.string().nonempty({ message: 'First name required' }),
            lastName: z.string().nonempty({ message: 'Last name required' }),
            invites: z.record(z.string(), z.string()),
          })
        ),
        address1: z.string().nullish().optional(),
        address2: z.string().nullish().optional(),
        city: z.string().nullish().optional(),
        state: z.string().nullish().optional(),
        country: z.string().nullish().optional(),
        zipCode: z.string().nullish().optional(),
        phoneNumber: z.string().nullish().optional(),
        email: z
          .string()
          .email({ message: 'Not a valid email' })
          .nullish()
          .optional(),
        notes: z.string().nullish().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('inputz', input);

      const userId = ctx.userId;

      const household = await ctx.prisma.household.create({
        data: {
          userId,
          address1: input?.address1,
          address2: input?.address2,
          city: input?.city,
          state: input?.state,
          country: input?.country,
          zipCode: input?.zipCode,
          phone: input?.phoneNumber,
          email: input?.email,
          notes: input?.notes,
          thankyou: false,
        },
      });

      if (!household) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create household',
        });
      }

      // TODO: look into prisma nested queries for ACID compliance
      const newGuests = await Promise.all(
        input.guestParty.map(async (guest, i) => {
          return await ctx.prisma.guest.create({
            data: {
              firstName: guest.firstName,
              lastName: guest.lastName,
              userId,
              householdId: household.id,
              isPrimaryContact: i === 0,
              invitations: {
                createMany: {
                  data: Object.entries(guest.invites).map(
                    ([eventId, rsvp]) => ({
                      eventId,
                      rsvp,
                      userId,
                    })
                  ),
                },
              },
            },
          });
        })
      );

      console.log('new guests', newGuests);

      if (!newGuests) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create guests',
        });
      }

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      // newGuests.forEach(async (guest, i) => {
      //   const invites = [];

      //   for (const [eventId, rsvp] of Object.entries(input.guestParty[i]!.invites)) {
      //     if (rsvp === 'Invited') invites.push(eventId);
      //   }

      //   await ctx.prisma.invitation.createMany({
      //     data: invites.map((eventId) => ({
      //       guestId: guest.id,
      //       eventId,
      //       rsvp: 'Invited',
      //       userId,
      //     })),
      //   });
      // });

      const householdData = {
        ...household,
        guests: await Promise.all(
          newGuests.map(async (guest) => {
            return {
              ...guest,
              invititations: await ctx.prisma.invitation.findMany({
                where: {
                  guestId: guest.id,
                },
              }),
            };
          })
        ),
      };
      console.log('dataz', householdData);

      return householdData;
    }),

  update: privateProcedure
    .input(
      z.object({
        householdId: z.string(),
        guestParty: z.array(
          z.object({
            guestId: z.number().optional(),
            firstName: z.string().nonempty({ message: 'First name required' }),
            lastName: z.string().nonempty({ message: 'Last name required' }),
            invites: z.record(z.string(), z.string()),
          })
        ),
        address1: z.string().nullish().optional(),
        address2: z.string().nullish().optional(),
        city: z.string().nullish().optional(),
        state: z.string().nullish().optional(),
        country: z.string().nullish().optional(),
        zipCode: z.string().nullish().optional(),
        phoneNumber: z.string().nullish().optional(),
        email: z
          .string()
          .email({ message: 'Not a valid email' })
          .nullish()
          .optional(),
        notes: z.string().nullish().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('inputz', input);

      const updatedHousehold = await ctx.prisma.household.update({
        where: {
          id: input.householdId,
        },
        data: {
          address1: input.address1 ?? undefined,
          address2: input.address2 ?? undefined,
          city: input.city ?? undefined,
          state: input.state ?? undefined,
          country: input.country ?? undefined,
          zipCode: input.zipCode ?? undefined,
          phone: input.phoneNumber ?? undefined,
          email: input.email ?? undefined,
          notes: input.notes ?? undefined,
        },
      });

      const updatedGuestParty = await Promise.all(
        input.guestParty.map(async (guest) => {
          console.log('input invitez: ', guest.invites);
          const updatedInvitations: Invitation[] = await Promise.all(
            Object.entries(guest.invites).map(
              async ([inviteEventId, inputRsvp]: string[]) => {
                return await ctx.prisma.invitation.update({
                  where: {
                    invitationId: {
                      eventId: inviteEventId!,
                      guestId: guest.guestId!,
                    },
                  },
                  data: {
                    rsvp: inputRsvp ?? undefined,
                  },
                });
              }
            )
          );

          if (updatedInvitations.length !== Object.keys(guest.invites).length)
            return Promise.reject();

          // console.log('updatedinvitatonz', updatedInvitations);

          const updatedGuests = await ctx.prisma.guest.update({
            where: {
              id: guest.guestId,
            },
            data: {
              firstName: guest.firstName ?? undefined,
              lastName: guest.lastName ?? undefined,
            },
          });

          console.log('guestz', updatedGuests);

          return {
            ...updatedGuests,
            invitations: updatedInvitations,
          };
        })
      );

      console.log('updated guests', updatedGuestParty);

      if (!updatedHousehold || !updatedGuestParty) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update guests',
        });
      }

      return {
        ...updatedHousehold,
        guests: updatedGuestParty,
      };
    }),

  delete: privateProcedure
    .input(z.object({ householdId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedHousehold = await ctx.prisma.household.delete({
        where: {
          id: input.householdId,
        },
      });

      return deletedHousehold.id;
    }),
});
