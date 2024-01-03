import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterOutputs } from "@/types";
import { type Country } from "@schema/types";
import { getData } from "./shared";

export const country = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const data = await getData({ endpoint: "/countries" });
    return data as { countries: Country[] };
  }),
});

// outputs
export type CountryListOuput = RouterOutputs["country"]["list"];
