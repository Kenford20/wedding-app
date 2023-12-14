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
        date: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().optional(),
        attire: z.string().optional(),
        description: z.string().optional(),
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
          date: date ? new Date(date) : undefined,
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

  update: privateProcedure
    .input(
      z.object({
        eventName: z.string().nonempty({ message: 'Event name required' }),
        date: z.string().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().optional(),
        attire: z.string().optional(),
        description: z.string().optional(),
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updatedEvent = await ctx.prisma.event.update({
        where: {
          id: input.eventId,
        },
        data: {
          name: input.eventName,
          date: input.date ? new Date(input.date) : undefined,
          startTime: input.startTime,
          endTime: input.endTime,
          venue: input.venue,
          attire: input.attire,
          description: input.description,
        },
      });
      return updatedEvent;
    }),

  delete: privateProcedure
    .input(
      z.object({
        eventId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.invitation.deleteMany({
        where: {
          eventId: input.eventId,
        },
      });

      const deletedEvent = await ctx.prisma.event.delete({
        where: {
          id: input.eventId,
        },
      });

      return deletedEvent;
    }),
});
