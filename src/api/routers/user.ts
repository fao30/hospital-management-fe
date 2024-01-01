import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/api/trpc";
import { type RouterOutputs } from "@/trpc/shared";
import { getData } from "./shared";

export const user = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const res = await getData({ endpoint: "/users" });
    return res;
  }),
});

// outputs
export type UserList = RouterOutputs["user"]["list"];

// inputs
