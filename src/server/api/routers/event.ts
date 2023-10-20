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
        eventName: z.string(),
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

  // find: publicProcedure
  //   .input(z.object({ websiteUrl: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.event.findFirst({
  //       where: {
  //         eventId: input.eventId,
  //       },
  //     });
  //     console.log(data);
  //     return !!data;
  //   }),
});
