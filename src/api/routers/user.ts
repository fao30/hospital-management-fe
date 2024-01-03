import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { postData } from "@routers/shared";
import { schema } from "@schema/schemas";

export const user = createTRPCRouter({
  register: publicProcedure.input(schema.user.register).query(async ({ input }) => {
    const data = await postData({ endpoint: "/register", body: input.body });
    return data as { message: string; info: { id: number; email: string; role: number } };
  }),
});

// outputs
export type UserRegisterOutput = RouterOutputs["user"]["register"];

// inputs
export type UserRegisterInput = RouterInputs["user"]["register"];
