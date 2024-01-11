import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type Treatment } from "@schema/types";
import { z } from "zod";
import { getData, postData, putData } from "./shared";

export const treatment = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const data = await getData({ endpoint: "/treatments" });
    return data as { treatments: Treatment[] };
  }),

  detail: protectedProcedure.input(z.object({ treatmentId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/treatments/${input.treatmentId}` });
    return data as Treatment;
  }),

  create: protectedProcedure.input(schema.treatment.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/treatments", body: input.body });
    return data as Treatment & DateTime;
  }),

  update: protectedProcedure.input(schema.treatment.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/treatments/${input.treatmentId}`, body: input.body });
    return data as { message: string };
  }),

  updateByDoctor: protectedProcedure.input(schema.treatment.updateByDoctor).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/treatments/${input.treatmentId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type TreatmentListOuput = RouterOutputs["treatment"]["list"];
export type TreatmentCreateOutput = RouterOutputs["treatment"]["create"];

// inputs
export type TreatmentCreateInput = RouterInputs["treatment"]["create"];
export type TreatmentUpdateInput = RouterInputs["treatment"]["update"];
