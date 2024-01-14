import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type MedicinesTreatment } from "@schema/types";
import { z } from "zod";
import { getData, postData, putData } from "./shared";

export const medicineTreatment = createTRPCRouter({
  list: protectedProcedure.query(async () => {
    const data = await getData({ endpoint: "/medicine-treatments" });
    return data as { medicine_treatments: MedicinesTreatment[] };
  }),

  detail: protectedProcedure.input(z.object({ medicineTreatmentId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/medicine-treatments/${input.medicineTreatmentId}` });
    return data as MedicinesTreatment;
  }),

  create: protectedProcedure.input(schema.medicineTreatment.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/medicine-treatments", body: input.body });
    return data as MedicinesTreatment & DateTime;
  }),

  update: protectedProcedure.input(schema.medicineTreatment.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/medicine-treatments/${input.medicineTreatmentId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type MedicineTreatmentListOuput = RouterOutputs["medicineTreatment"]["list"];
export type MedicineTreatmentCreateOutput = RouterOutputs["medicineTreatment"]["create"];

// inputs
export type MedicineTreatmentCreateInput = RouterInputs["medicineTreatment"]["create"];
export type MedicineTreatmentUpdateInput = RouterInputs["medicineTreatment"]["update"];
