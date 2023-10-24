import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const eventRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        eventName: z.string().nonempty({ message: 'Event name required' }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const { eventName: name } = input;

      const newEvent = await ctx.prisma.event.create({
        data: {
          name,
          userId,
        },
      });

      return newEvent;
    }),

  getAllByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;
    const events = await ctx.prisma.event.findMany({
      where: {
        userId: ctx.userId,
      },
    });
    console.log('eventz2', events);
    return events;
  }),
});
