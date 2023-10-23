import { websitesRouter } from '~/server/api/routers/websites';
import { createTRPCRouter } from '~/server/api/trpc';
import { eventRouter } from './routers/event';
import { guestRouter } from './routers/guests';
import { invitationsRouter } from './routers/invitations';

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
});

// export type definition of API
export type AppRouter = typeof appRouter;
