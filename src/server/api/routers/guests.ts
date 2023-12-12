import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';

export const guestRouter = createTRPCRouter({
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
