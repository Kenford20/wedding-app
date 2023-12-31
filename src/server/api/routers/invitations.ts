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
        guestId: z.number(),
        eventId: z.string(),
        rsvp: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const { guestId, eventId, rsvp } = input;

      const newInvitation = await ctx.prisma.invitation.create({
        data: {
          guestId,
          eventId,
          rsvp,
          userId,
        },
      });

      return newInvitation;
    }),

  update: privateProcedure
    .input(
      z.object({
        guestId: z.number(),
        eventId: z.string(),
        rsvp: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedInvitation = await ctx.prisma.invitation.update({
        where: {
          invitationId: {
            guestId: input.guestId,
            eventId: input.eventId,
          },
        },
        data: {
          rsvp: input.rsvp,
        },
      });
      return updatedInvitation;
    }),

  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;
    const invitations = await ctx.prisma.invitation.findMany({
      where: {
        userId: ctx.userId,
      },
    });
    return invitations;
  }),
});
