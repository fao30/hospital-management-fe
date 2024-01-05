import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterOutputs } from "@/types";
import { type Role } from "@schema/types";
import { getData } from "./shared";

export const role = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const data = await getData({ endpoint: "/roles" });
    return data as { roles: Role[] };
  }),
});

// outputs
export type RoleListOutput = RouterOutputs["role"]["list"];
