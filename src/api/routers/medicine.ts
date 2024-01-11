import { createTRPCRouter, protectedProcedure } from "@/api/trpc";
import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema } from "@schema/schemas";
import { type DateTime, type Medicine, type PaginationResponse } from "@schema/types";
import { z } from "zod";
import { getData, postData, putData } from "./shared";

export const medicine = createTRPCRouter({
  list: protectedProcedure.input(schema.medicine.list).query(async () => {
    const data = await getData({ endpoint: "/medicines" });
    return data as { medicines: Medicine[] } & PaginationResponse;
  }),

  detail: protectedProcedure.input(z.object({ medicineId: z.number() })).query(async ({ input }) => {
    const data = await getData({ endpoint: `/medicines/${input.medicineId}` });
    return data as Medicine;
  }),

  create: protectedProcedure.input(schema.medicine.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: "/medicines", body: input.body });
    return data as Medicine & DateTime;
  }),

  update: protectedProcedure.input(schema.medicine.update).mutation(async ({ input }) => {
    const data = await putData({ endpoint: `/medicines/${input.medicineId}`, body: input.body });
    return data as { message: string };
  }),
});

// outputs
export type MedicineListOuput = RouterOutputs["medicine"]["list"];
export type MedicineCreateOutput = RouterOutputs["medicine"]["create"];

// inputs
export type MedicineCreateInput = RouterInputs["medicine"]["create"];
export type MedicineUpdateInput = RouterInputs["medicine"]["update"];
export type MedicineListInput = RouterInputs["medicine"]["list"];
