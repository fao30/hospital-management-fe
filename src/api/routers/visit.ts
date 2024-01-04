import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type MedicinesTreatment, type Treatment, type Visit } from "@schema/types";
import { z } from "zod";
import { getData, postData } from "./shared";

export const visit = createTRPCRouter({
  list: publicProcedure.query(async () => {
    type Visits = Visit & {
      Treatments: Treatment[];
      Medicines_Treatments: MedicinesTreatment[];
    };

    const data = (await getData({ endpoint: "/visits" })) as { visits: Visits[] };

    const updatedData = data.visits.map((visit) => ({
      ...visit,
      weight: parseFloat(visit.weight.toString()),
      height: parseFloat(visit.height.toString()),
      temperature: parseFloat(visit.temperature.toString()),
      blood_presure: parseFloat(visit.blood_presure.toString()),
    }));
    return updatedData;
  }),

  detail: publicProcedure.input(z.object({ visitId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/visits/${input.visitId}` });
    return data as Visit;
  }),

  create: publicProcedure.input(schema.visit.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/visits", body: input.body });
    return data as Visit & DateTime;
  }),

  update: publicProcedure.input(schema.visit.update).mutation(async ({ input }) => {
    const data = await postData({ endpoint: `/visits/${input.visitId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type VisitListOuput = RouterOutputs["visit"]["list"];
export type VisitCreateOutput = RouterOutputs["visit"]["create"];

// inputs
export type VisitCreateInput = RouterInputs["visit"]["create"];
export type VisitUpdateInput = RouterInputs["visit"]["update"];
