import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { type DateTime, type Hospital } from "@schema/types";
import { schema } from "../schema/schemas";
import { getData, postData } from "./shared";

export const hospital = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const data = await getData({ endpoint: "/hospitals" });
    return data as { hospitals: Hospital[] };
  }),

  create: publicProcedure.input(schema.hospital.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/hospitals", body: input.body });
    return data as Hospital & DateTime;
  }),

  update: publicProcedure.input(schema.hospital.update).mutation(async ({ input }) => {
    const data = await postData({ endpoint: `/hospitals${input.hospitalId}`, body: input.body });
    return data;
  }),
});

// outputs
export type HospitalListOuput = RouterOutputs["hospital"]["list"];
export type HospitalCreateOutput = RouterOutputs["hospital"]["create"];

// inputs
export type HospitalCreateInput = RouterInputs["hospital"]["create"];
