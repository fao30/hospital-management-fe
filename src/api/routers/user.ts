import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs, type User } from "@/types";
import { schema } from "@schema";
import { getData } from "./shared";

export const user = createTRPCRouter({
  create: publicProcedure.input(schema.user.create).mutation(async ({ input }) => {
    console.log(input.body.name);
    return null;
  }),

  list: publicProcedure.input(schema.user.list).query(async ({ input }) => {
    const data = await getData({ endpoint: "/user", params: input.params });
    return data as User[];
  }),
});

// outputs
export type UserList = RouterOutputs["user"]["list"];

// inputs
export type UserCreateInput = RouterInputs["user"]["create"];
