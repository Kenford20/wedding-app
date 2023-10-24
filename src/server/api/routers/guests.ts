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
        guestFirstName: z.string().nonempty({ message: 'First name required' }),
        guestLastName: z.string().nonempty({ message: 'Last name required' }),
        eventIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;
      const { guestFirstName, guestLastName, eventIds } = input;

      const newGuest = await ctx.prisma.guest.create({
        data: {
          guestFirstName,
          guestLastName,
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
});
