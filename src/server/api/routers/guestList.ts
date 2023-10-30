import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const guestListRouter = createTRPCRouter({
  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;

    const guests = await ctx.prisma.guest.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    const rsvps = await ctx.prisma.invitation.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    const events = await ctx.prisma.event.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    type Rsvp = {
      eventId: string;
      rsvp: string | null;
    };

    const guestListData = {
      guests: guests.map((guest) => {
        return {
          ...guest,
          rsvps: rsvps.reduce((acc: Rsvp[], rsvp) => {
            if (guest.id === rsvp.guestId) {
              acc.push({
                eventId: rsvp.eventId,
                rsvp: rsvp.rsvp,
              });
            }
            return acc;
          }, []),
        };
      }),
      events,
    };

    return guestListData;
  }),
});
