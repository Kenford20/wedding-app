import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const guestRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        guestFirstName: z.string(),
        guestLastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.userId;

      const { guestFirstName, guestLastName, eventId } = input;

      const newGuest = await ctx.prisma.guest.create({
        data: {
          guestFirstName,
          guestLastName,
          eventId,
        },
      });

      return newGuest;
    }),

  // find: publicProcedure
  //   .input(z.object({ websiteUrl: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const data = await ctx.prisma.guest.findFirst({
  //       where: {
  //         eventId: input.eventId,
  //       },
  //     });
  //     console.log(data);
  //     return !!data;
  //   }),
});
