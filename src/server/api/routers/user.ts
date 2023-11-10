import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const userRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;
    const invitations = await ctx.prisma.user.findFirst({
      where: {
        id: ctx.userId,
      },
    });
    return invitations;
  }),
});
