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
        firstName: z.string().nonempty({ message: 'First name required' }),
        lastName: z.string().nonempty({ message: 'Last name required' }),
        eventIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await new Promise((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, 5000)
      );

      const userId = ctx.userId;
      const { firstName, lastName, eventIds } = input;

      const newGuest = await ctx.prisma.guest.create({
        data: {
          firstName,
          lastName,
          userId,
        },
      });

      const newInvitations = await ctx.prisma.invitation.createMany({
        data: eventIds.map((eventId) => {
          return {
            guestId: newGuest.id,
            eventId,
            rsvp: 'Invited',
            userId,
          };
        }),
      });
      console.log('foo', newInvitations);

      return newGuest;
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
