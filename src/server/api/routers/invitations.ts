import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const invitationsRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        guestId: z.string(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const { guestId, eventId } = input;

      const newInvitation = await ctx.prisma.invitation.create({
        data: {
          guestId,
          eventId,
          userId,
        },
      });

      return newInvitation;
    }),

  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    const invitations = await ctx.prisma.invitation.findMany({
      where: {
        userId: ctx.userId,
      },
    });
    return invitations;
  }),
});
