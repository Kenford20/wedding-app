import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const guestRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        guestParty: z.array(
          z.object({
            firstName: z.string().nonempty({ message: 'First name required' }),
            lastName: z.string().nonempty({ message: 'Last name required' }),
            invites: z.array(z.string()),
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
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, 5000)
      );
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
      newGuests.forEach(async (guest, i) => {
        await ctx.prisma.invitation.createMany({
          data: input.guestParty[i]!.invites.map((eventId) => ({
            guestId: guest.id,
            eventId,
            rsvp: 'Invited',
            userId,
          })),
        });
      });

      return {
        ...household,
        guests: newGuests,
      };
    }),

  // delete: publicProcedure
  //   .input(z.object({ guestId: z.string() }))
  //   .query(async ({ ctx, input }) => {}),

  getAllByEventId: publicProcedure
    .input(z.object({ eventId: z.string() }))
    .query(async ({ ctx, input }) => {
      const guestList = await ctx.prisma.invitation.findMany({
        where: {
          eventId: input.eventId,
        },
      });

      return guestList;
    }),

  getAllByHouseholdId: publicProcedure
    .input(z.object({ householdId: z.string() }))
    .query(async ({ ctx, input }) => {
      const householdGuests = await ctx.prisma.household.findFirst({
        where: {
          id: input.householdId,
        },
        include: {
          guests: true,
        },
      });

      return householdGuests;
    }),

  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;
    const guestList = await ctx.prisma.guest.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    return guestList;
  }),
});
