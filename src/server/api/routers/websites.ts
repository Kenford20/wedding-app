import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { formatDateNumber } from '../utils';

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
        basePath: z.string(),
        email: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('userz', ctx.userId);
      console.log('inputz', input);
      const userId = ctx.userId;

      // TODO: needa check for dupes
      const {
        firstName,
        lastName,
        partnerFirstName,
        partnerLastName,
        basePath,
        email,
      } = input;
      const subUrl =
        `${firstName}${lastName}and${partnerFirstName}${partnerLastName}`.toLowerCase();
      const url = `${basePath}/websites/${subUrl}`;

      const websiteUrl = await ctx.prisma.website.create({
        data: {
          userId,
          url,
          subUrl,
        },
      });

      await ctx.prisma.event.create({
        data: {
          name: 'Wedding Day',
          userId,
        },
      });

      await ctx.prisma.user.create({
        data: {
          id: userId,
          websiteUrl: url,
          email,
          groomFirstName: firstName,
          groomLastName: lastName,
          brideFirstName: partnerFirstName,
          brideLastName: partnerLastName,
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
      const website = await ctx.prisma.website.findFirst({
        where: {
          subUrl: input.websiteUrl,
        },
      });
      return !!website;
    }),

  fetchWeddingData: publicProcedure
    .input(z.object({ subUrl: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.userId) return;

      const currentWebsite = await ctx.prisma.website.findFirst({
        where: {
          subUrl: input.subUrl,
        },
      });

      if (!currentWebsite) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'This website does not exist.',
        });
      }

      type TweddingUser = {
        groomFirstName: string;
        groomLastName: string;
        brideFirstName: string;
        brideLastName: string;
      };

      const weddingUser: TweddingUser | null = await ctx.prisma.user.findFirst({
        where: {
          id: currentWebsite.userId,
        },
      });

      if (!weddingUser) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch wedding website data.',
        });
      }

      const events = await ctx.prisma.event.findMany({
        where: {
          userId: ctx.userId,
        },
      });

      const weddingDate = events.find(
        (event) => event.name === 'Wedding Day'
      )?.date;

      const weddingData = {
        groomFirstName: weddingUser.groomFirstName,
        groomLastName: weddingUser.groomLastName,
        brideFirstName: weddingUser.brideFirstName,
        brideLastName: weddingUser.brideLastName,
        date: {
          standardFormat: weddingDate ?? 'October 30, 2024',
          numberFormat: formatDateNumber(weddingDate) ?? '10.30.2024',
        },
        daysRemaining: 100,
        events,
      };

      return weddingData;
    }),
});
