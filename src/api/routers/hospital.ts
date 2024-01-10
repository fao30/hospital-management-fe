import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type Hospital } from "@schema/types";
import { z } from "zod";
import { getData, postData, putData } from "./shared";

export const hospital = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const data = await getData({ endpoint: "/hospitals" });
    return data as { hospitals: Hospital[] };
  }),

  detail: protectedProcedure.input(z.object({ hospitalId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/hospitals/${input.hospitalId}` });
    return data as Hospital;
  }),

  create: protectedProcedure.input(schema.hospital.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/hospitals", body: input.body });
    return data as Hospital & DateTime;
  }),

  update: protectedProcedure.input(schema.hospital.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/hospitals/${input.hospitalId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type HospitalListOuput = RouterOutputs["hospital"]["list"];
export type HospitalCreateOutput = RouterOutputs["hospital"]["create"];

// inputs
export type HospitalCreateInput = RouterInputs["hospital"]["create"];
export type HospitalUpdateInput = RouterInputs["hospital"]["update"];
