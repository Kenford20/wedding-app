import { websitesRouter } from '~/server/api/routers/websites';
import { createTRPCRouter } from '~/server/api/trpc';
import { eventRouter } from './routers/event';
import { giftRouter } from './routers/gift';
import { guestListRouter } from './routers/guestList';
import { guestRouter } from './routers/guests';
import { householdRouter } from './routers/household';
import { invitationsRouter } from './routers/invitations';
import { userRouter } from './routers/user';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  website: websitesRouter,
  guest: guestRouter,
  event: eventRouter,
  invitation: invitationsRouter,
  guestList: guestListRouter,
  user: userRouter,
  household: householdRouter,
  gift: giftRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
