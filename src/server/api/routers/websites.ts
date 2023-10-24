import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';

export const websitesRouter = createTRPCRouter({
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

      // TODO: needa check for dupes
      const { firstName, lastName, partnerFirstName, partnerLastName } = input;
      const url = `${firstName}-${lastName}-and-${partnerFirstName}-${partnerLastName}`;

      const websiteUrl = await ctx.prisma.website.create({
        data: {
          userId,
          url,
        },
      });

      await ctx.prisma.event.create({
        data: {
          name: 'Wedding Day',
          userId,
        },
      });

      return websiteUrl;
    }),

  getByUserId: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.userId) return;
    const websiteUrlByUserId = await ctx.prisma.website.findFirst({
      where: {
        userId: ctx.userId,
      },
    });

    return websiteUrlByUserId;
  }),

  find: publicProcedure
    .input(z.object({ websiteUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.website.findFirst({
        where: {
          url: input.websiteUrl,
        },
      });
      console.log(data);
      return !!data;
    }),
});
