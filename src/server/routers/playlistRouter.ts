import { router, databaseProcedure, userProcedure } from "@/src/server/trpc";
import { z } from "zod";
import { experiences, playlists } from "@/src/db/schema";
import { eq, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const playlistRouter = router({
  getPlaylist: databaseProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.db.query.playlists
        .findFirst({
          where: eq(playlists.id, input.id),
          columns: {
            id: true,
            name: true,
            description: true,
            orderedExperienceIds: true,
          },
          with: { user: true },
        })
        .execute();

      if (!playlist)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Playlist not found",
        });

      const playlistExperiences = await ctx.db.query.experiences.findMany({
        where: inArray(experiences.id, playlist.orderedExperienceIds),
        columns: { id: true, name: true, status: true },
        with: {
          song: true,
        },
      });

      // Sort the experiences in the order they are in the playlist
      playlistExperiences.sort(
        (a, b) =>
          playlist.orderedExperienceIds.indexOf(a.id) -
          playlist.orderedExperienceIds.indexOf(b.id)
      );

      return { playlist, experiences: playlistExperiences };
    }),

  savePlaylist: userProcedure
    .input(
      z.object({
        id: z.number().optional(),
        name: z.string(),
        description: z.string(),
        orderedExperienceIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, description, orderedExperienceIds } = input;

      const playlistData = {
        name,
        description,
        orderedExperienceIds,
      };

      if (id) {
        await ctx.db
          .update(playlists)
          .set(playlistData)
          .where(eq(playlists.id, id))
          .execute();
        return id;
      }

      return await ctx.db
        .insert(playlists)
        .values({
          ...playlistData,
          userId: ctx.user.id,
        })
        .returning({ id: playlists.id })
        .execute();
    }),

  listPlaylistsForUser: userProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.playlists
      .findMany({
        where: eq(playlists.userId, ctx.user.id),
        columns: {
          id: true,
          name: true,
          description: true,
          orderedExperienceIds: true,
          isLocked: true,
        },
      })
      .execute();
  }),
});
