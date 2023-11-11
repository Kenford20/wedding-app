import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { type User } from '~/types/schema';
import { formatDateNumber } from '../utils';

export const guestListRouter = createTRPCRouter({
  getByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;

    const currentUser: User | null = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.userId,
      },
    });

    if (!currentUser) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch wedding website data.',
      });
    }

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

    const weddingDate = events.find(
      (event) => event.name === 'Wedding Day'
    )?.date;

    const weddingData = {
      groomFirstName: currentUser.groomFirstName,
      groomLastName: currentUser.groomLastName,
      brideFirstName: currentUser.brideFirstName,
      brideLastName: currentUser.brideLastName,
      websiteUrl: currentUser.websiteUrl,
      date: {
        standardFormat: weddingDate ?? 'October 30, 2024',
        numberFormat: formatDateNumber(weddingDate) ?? '10.30.2024',
      },
      daysRemaining: 100,
      events,
    };

    type Rsvp = {
      eventId: string;
      rsvp: string | null;
    };

    const guestListData = {
      weddingData,
      totalGuests: guests.length,
      totalEvents: events.length,
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
      events: events.map((event) => {
        const guestResponses = {
          invited: 0,
          accepted: 0,
          declined: 0,
          noResponse: 0,
        };

        rsvps.forEach((rsvp) => {
          if (event.id === rsvp.eventId) {
            switch (rsvp.rsvp) {
              case 'Invited':
                guestResponses.invited = guestResponses.invited + 1;
                break;
              case 'Accepted':
                guestResponses.accepted = guestResponses.accepted + 1;
                break;
              case 'Declined':
                guestResponses.declined = guestResponses.declined + 1;
                break;
              default:
                guestResponses.noResponse = guestResponses.noResponse + 1;
                break;
            }
          }
        });

        return {
          ...event,
          guestResponses,
        };
      }),
    };

    return guestListData;
  }),
});
