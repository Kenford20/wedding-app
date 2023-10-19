import { websitesRouter } from '~/server/api/routers/websites';
import { createTRPCRouter } from '~/server/api/trpc';
import { guestRouter } from './routers/guests';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  website: websitesRouter,
  guest: guestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
