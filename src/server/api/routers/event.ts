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
        date: z.string(),
        startTime: z.string(),
        endTime: z.string(),
        venue: z.string(),
        attire: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const {
        eventName: name,
        date,
        startTime,
        endTime,
        venue,
        attire,
        description,
      } = input;

      const newEvent = await ctx.prisma.event.create({
        data: {
          name,
          userId,
          date: new Date(date),
          startTime,
          endTime,
          venue,
          attire,
          description,
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
