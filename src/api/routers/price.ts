import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type PaginationResponse, type Price } from "../schema/types";
import { getData, postData } from "./shared";

export const price = createTRPCRouter({
  list: protectedProcedure.input(schema.price.list).query(async ({ input }) => {
    type Response = { list_prices: Price[] } & PaginationResponse;
    const data = (await getData({ endpoint: "/list-prices", params: input })) as Response;

    return data;
  }),

  create: protectedProcedure.input(schema.price.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/list-prices", body: input.body });
    return data as Price & DateTime;
  }),
});

// outputs
export type PriceListOutput = RouterOutputs["price"]["list"];
export type PriceCreateOutput = RouterOutputs["price"]["create"];

// input
export type PriceListInput = RouterInputs["price"]["list"];
export type PriceCreateInput = RouterInputs["price"]["create"];
