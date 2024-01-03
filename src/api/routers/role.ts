import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterOutputs } from "@/types";
import { type Role } from "../schema/types";
import { getData } from "./shared";

export const role = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const data = await getData({ endpoint: "/roles" });
    return data as { roles: Role[] };
  }),
});

// outputs
export type RoleList = RouterOutputs["role"]["list"];
