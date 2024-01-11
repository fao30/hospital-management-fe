import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import {
  type DateTime,
  type Hospital,
  type MedicinesTreatment,
  type PaginationResponse,
  type Treatment,
  type User,
  type Visit,
} from "@schema/types";
import { z } from "zod";
import { getData, postData, putData } from "./shared";

export const visit = createTRPCRouter({
  list: protectedProcedure.input(schema.visit.list).query(async ({ input }) => {
    type Response = { visits: (Visit & { Hospital: Hospital; User: User })[] } & PaginationResponse;
    const { visits, ...rest } = (await getData({ endpoint: "/visits", params: input })) as Response;
    return {
      ...rest,
      visits: visits.map((e) => ({
        ...e,
        weight: parseFloat(e.weight.toString()),
        height: parseFloat(e.height.toString()),
        temperature: parseFloat(e.temperature.toString()),
        blood_presure: parseFloat(e.blood_presure.toString()),
      })),
    };
  }),

  detail: protectedProcedure.input(z.object({ visitId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/visits/${input.visitId}` });

    const updatedData = structuredClone(data) as {
      visit: Visit & { currency?: string } & { User: User & { Visits: Visit[] } } & { Hospital: Hospital } & {
        Treatments: (Treatment & {
          Medicines_Treatments: MedicinesTreatment[];
        })[];
      };
    };
    updatedData.visit.currency = updatedData.visit.Treatments[0]?.currency ?? undefined;

    return updatedData;
  }),

  create: protectedProcedure.input(schema.visit.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/visits", body: input.body });
    return data as Visit & DateTime;
  }),

  update: protectedProcedure.input(schema.visit.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/visits/${input.visitId}`, body: input.body });
    return data as { message: string };
  }),

  updatePaidAmount: protectedProcedure
    .input(z.object({ visitId: z.number(), body: z.object({ paid_amount: z.number().nonnegative() }) }))
    .mutation(async ({ input }) => await putData({ endpoint: `/visits/${input.visitId}`, body: input.body })),

  updateDueAmount: protectedProcedure
    .input(z.object({ visitId: z.number(), body: z.object({ due_amount: z.number().nonnegative() }) }))
    .mutation(async ({ input }) => await putData({ endpoint: `/visits/${input.visitId}`, body: input.body })),
});

// outputs
export type VisitListOutput = RouterOutputs["visit"]["list"];
export type VisitCreateOutput = RouterOutputs["visit"]["create"];
export type VisitDetailOutput = RouterOutputs["visit"]["detail"];

// inputs
export type VisitCreateInput = RouterInputs["visit"]["create"];
export type VisitUpdateInput = RouterInputs["visit"]["update"];
export type VisitListInput = RouterInputs["visit"]["list"];
