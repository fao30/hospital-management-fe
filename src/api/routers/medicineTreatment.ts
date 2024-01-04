import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type MedicinesTreatment } from "@schema/types";
import { z } from "zod";
import { getData, postData } from "./shared";

export const medicineTreatment = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const data = await getData({ endpoint: "/medicine-treatments" });
    return data as { medicine_treatments: MedicinesTreatment[] };
  }),

  detail: publicProcedure.input(z.object({ medicineTreatmentId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/medicine-treatments/${input.medicineTreatmentId}` });
    return data as MedicinesTreatment;
  }),

  create: publicProcedure.input(schema.medicineTreatment.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/medicine-treatments", body: input.body });
    return data as MedicinesTreatment & DateTime;
  }),

  update: publicProcedure.input(schema.medicineTreatment.update).mutation(async ({ input }) => {
    const data = await postData({ endpoint: `/medicine-treatments/${input.medicineTreatmentId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type MedicineTreatmentListOuput = RouterOutputs["medicine"]["list"];
export type MedicineTreatmentCreateOutput = RouterOutputs["medicine"]["create"];

// inputs
export type MedicineTreatmentCreateInput = RouterInputs["medicine"]["create"];
export type MedicineTreatmentUpdateInput = RouterInputs["medicine"]["update"];
