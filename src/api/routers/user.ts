import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/api/trpc";
import { getData } from "./shared";

export const user = createTRPCRouter({
  list: publicProcedure.query(async (opts) => {
    const res = await getData({ endpoint: "/users" });
    return res;
  }),
});
