import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs } from "@/types";
import { postData } from "@routers/shared";
import { schema } from "@schema/schemas";

export const user = createTRPCRouter({
  register: publicProcedure.input(schema.user.register).query(async ({ input }) => {
    return await postData({ endpoint: "/register", body: input.body });
  }),
});

// inputs
export type UserRegisterInput = RouterInputs["user"]["register"];
