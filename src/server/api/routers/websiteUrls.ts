import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const websiteUrlsRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),
  create: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        partnerFirstName: z.string(),
        partnerLastName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('userz', ctx.userId);
      console.log('inputz', input);
      const userId = ctx.userId;

      const { firstName, lastName, partnerFirstName, partnerLastName } = input;
      const url = `${firstName}-${lastName}-and-${partnerFirstName}-${partnerLastName}`;

      const websiteUrl = await ctx.prisma.websiteUrls.create({
        data: {
          userId,
          url,
        },
      });

      return websiteUrl;
    }),
  find: publicProcedure
    .input(z.object({ websiteUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.websiteUrls.findFirst({
        where: {
          url: input.websiteUrl,
        },
      });
      console.log(data);
      return !!data;
    }),
});
