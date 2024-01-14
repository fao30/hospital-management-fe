import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { z } from "zod";
import { type DateTime, type List_Price, type PaginationResponse } from "../schema/types";
import { getData, postData, putData } from "./shared";

export const price = createTRPCRouter({
  list: protectedProcedure.input(schema.price.list).query(async ({ input }) => {
    type Response = { list_prices: List_Price[] } & PaginationResponse;
    const data = (await getData({ endpoint: "/list-prices", params: input })) as Response;

    return data;
  }),

  create: protectedProcedure.input(schema.price.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/list-prices", body: input.body });
    return data as List_Price & DateTime;
  }),

  update: protectedProcedure.input(schema.price.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/list-prices/${input.list_price_id.toString()}`, body: input.body });
    return data as List_Price & DateTime;
  }),

  search: protectedProcedure.input(z.object({ key_words: z.string() })).query(async ({ input }) => {
    const data = await getData({ endpoint: "/search/price-list", params: input });
    return data as { search: List_Price[] };
  }),
});

// outputs
export type PriceListOutput = RouterOutputs["price"]["list"];
export type PriceCreateOutput = RouterOutputs["price"]["create"];

// input
export type PriceListInput = RouterInputs["price"]["list"];
export type PriceCreateInput = RouterInputs["price"]["create"];
export type PriceUpdateInput = RouterInputs["price"]["update"];
