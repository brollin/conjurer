import { getProdDatabase } from "@/src/db/prod";
import { getLocalDatabase } from "@/src/db/local";
import { TRPCClientError } from "@trpc/client";
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure;

// TODO: later on call this authedProcedure
export const withDatabaseProcedure = publicProcedure
  .input(
    z.object({
      usingLocalData: z.boolean(),
    })
  )
  .use(async (opts) => {
    const { usingLocalData } = opts.input;

    if (usingLocalData && process.env.NODE_ENV === "production") {
      throw new TRPCClientError("Local database cannot be used in production");
    }

    try {
      return opts.next({
        ctx: {
          db: usingLocalData ? getLocalDatabase() : getProdDatabase(),
        },
      });
    } catch (e) {
      console.error(e);
      throw new TRPCClientError("Database connection error, check log");
    }
  });
