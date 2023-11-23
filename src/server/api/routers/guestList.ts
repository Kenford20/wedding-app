import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { formatDateNumber } from '../utils';

import { type User } from '~/types/schema';

export const guestListRouter = createTRPCRouter({
  getByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return null;

    const currentUser: User | null = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.userId,
      },
    });
    if (!currentUser) return null;

    const households = await ctx.prisma.household.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        guests: true,
        id: true,
        address1: true,
        address2: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        phone: true,
        email: true,
        notes: true,
      },
    });

    const invitations = await ctx.prisma.invitation.findMany({
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
        standardFormat:
          weddingDate?.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }) ?? 'October 30, 2024',
        numberFormat: formatDateNumber(weddingDate) ?? '10.30.2024',
      },
      daysRemaining: 100,
    };

    type TInvitation = {
      eventId: string;
      invitation: string | null;
    };

    const guestListData = {
      weddingData,
      totalGuests: await ctx.prisma.guest.count({
        where: {
          userId: ctx.userId,
        },
      }),
      totalEvents: events.length,
      households: households.map((household) => {
        return {
          ...household,
          guests: household.guests.map((guest) => {
            return {
              ...guest,
              invitations: invitations.reduce(
                (acc: TInvitation[], invitation) => {
                  if (guest.id === invitation.guestId) {
                    acc.push({
                      eventId: invitation.eventId,
                      invitation: invitation.rsvp,
                    });
                  }
                  return acc;
                },
                []
              ),
            };
          }),
        };
      }),
      // invited: await ctx.prisma.invitation.count({
      //   where: {
      //     eventId: 'clp5iyeii0001skfr8wc7njt1',
      //     rsvp: 'Invited',
      //   },
      // }),
      events: events.map((event) => {
        const guestResponses = {
          invited: 0,
          accepted: 0,
          declined: 0,
          noResponse: 0,
        };

        invitations.forEach((rsvp) => {
          if (event.id === rsvp.eventId) {
            switch (rsvp.rsvp) {
              case 'Invited':
                guestResponses.invited += 1;
                break;
              case 'Accepted':
                guestResponses.accepted += 1;
                break;
              case 'Declined':
                guestResponses.declined += 1;
                break;
              default:
                guestResponses.noResponse += 1;
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

// const eventInvitations = invitations.filter(
//   (rsvp) => rsvp.eventId === event.id
// );
// type THouseholdList = Record<string, Guest[]>;
// const householdList: THouseholdList = {};

// eventInvitations.map((invitation) =>
//   guests.find((guest) => {
//     if (guest.id === invitation.guestId) {
//       if (householdList[guest.householdId]) {
//         householdList[guest.householdId] = [
//           ...(householdList[guest.householdId] ?? []),
//           guest,
//         ];
//       } else {
//         householdList[guest.householdId] = [guest];
//       }
//     }
//     return guest.id === invitation.guestId;
//   })
// );

// const guestList = await ctx.prisma.invitation
//   .findMany({
//     where: {
//       eventId: event.id,
//     },
//     select: {
//       guest: true,
//     },
//   })
//   .then((invitationsForThisEvent) =>
//     invitationsForThisEvent.map((res) => res.guest)
//   )
//   .then((guestsForThisEvent) => {
//     type THouseholdGroups = Record<string, Guest[]>;
//     const householdGroups: THouseholdGroups = {};
//     guestsForThisEvent.forEach((guest) => {
//       if (!guest) return [];
//       if (householdGroups[guest.householdId]) {
//         householdGroups[guest.householdId] = [
//           ...(householdGroups[guest.householdId] ?? []),
//           guest,
//         ];
//       } else {
//         householdGroups[guest.householdId] = [guest];
//       }
//     });
//     return householdGroups;
//   });

// console.log('eventz', event.name);
// console.log('listz', householdList);
