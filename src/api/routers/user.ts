import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { schema } from "@schema";

export const user = createTRPCRouter({
  create: publicProcedure.input(schema.user.create).mutation(async ({ input }) => {
    console.log(input.body.name);
    return null;
  }),
});
