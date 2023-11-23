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
        contactData: z
          .object({
            address1: z.string().nullish(),
            address2: z.string().nullish(),
            city: z.string().nullish(),
            state: z.string().nullish(),
            country: z.string().nullish(),
            zipCode: z.string().nullish(),
            phoneNumber: z.string().nullish(),
            email: z.string().email({ message: 'Not a valid email' }).nullish(),
            notes: z.string().nullish(),
          })
          .optional(),
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
        data: { userId },
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
            data:
              i === 0
                ? {
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    userId,
                    householdId: household.id,
                    address1: input?.contactData?.address1,
                    address2: input?.contactData?.address2,
                    city: input?.contactData?.city,
                    state: input?.contactData?.state,
                    country: input?.contactData?.country,
                    zipCode: input?.contactData?.zipCode,
                    phone: input?.contactData?.phoneNumber,
                    email: input?.contactData?.email,
                    notes: input?.contactData?.notes,
                  }
                : {
                    firstName: guest.firstName,
                    lastName: guest.lastName,
                    userId,
                    householdId: household.id,
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
        id: household.id,
        guests: newGuests,
      };
    }),

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
