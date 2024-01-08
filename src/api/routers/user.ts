import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { getData, postData } from "@routers/shared";
import { schema } from "@schema/schemas";
import { type Hospital, type PaginationResponse, type Role, type User } from "@schema/types";

export const user = createTRPCRouter({
  register: protectedProcedure.input(schema.user.register).query(async ({ input }) => {
    const data = await postData({ endpoint: "/register", body: input.body });
    return data as { message: string; info: { id: number; email: string; role: number } };
  }),

  list: protectedProcedure.input(schema.user.list).query(async ({ input }) => {
    type Response = { users: (User & Role)[] } & PaginationResponse & { hospital: Hospital };

    const data = (await getData({ endpoint: "/users", params: input })) as Response;
    return data;
  }),
});

// outputs
export type UserRegisterOutput = RouterOutputs["user"]["register"];
export type UserListOutput = RouterOutputs["user"]["list"];

// inputs
export type UserRegisterInput = RouterInputs["user"]["register"];
export type UserListInput = RouterInputs["user"]["list"];
