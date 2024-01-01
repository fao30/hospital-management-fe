import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { schema } from "@schema";
import { getData } from "./shared";

export const user = createTRPCRouter({
  create: publicProcedure.input(schema.user.create).mutation(async ({ input }) => {
    console.log(input.body.name);
    return null;
  }),

  list: publicProcedure.input(schema.user.list).query(async ({ input }) => {
    const data = await getData({ endpoint: "/user", params: input.params });
    return data;
  }),
});
