import { createTRPCRouter, publicProcedure } from "@/api/trpc";
import { type RouterOutputs } from "@/types";
import { type PaymentStatus } from "@schema/types";
import { getData } from "./shared";

export const paymentStatus = createTRPCRouter({
  list: publicProcedure.query(async () => {
    const data = await getData({ endpoint: "/paymentStatuses" });
    return data as { payment_statuses: PaymentStatus[] };
  }),
});

// outputs
export type PaymentStatusList = RouterOutputs["paymentStatus"]["list"];
