import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const giftRouter = createTRPCRouter({
  update: privateProcedure
    .input(
      z.object({
        householdId: z.string(),
        eventId: z.string(),
        description: z.string().optional(),
        thankyou: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedGift = await ctx.prisma.gift.update({
        where: {
          GiftId: {
            householdId: input.householdId,
            eventId: input.eventId,
          },
        },
        data: {
          description: input.description,
          thankyou: input.thankyou,
        },
      });
      return updatedGift;
    }),
});
