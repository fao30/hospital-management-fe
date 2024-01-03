import { createTRPCRouter } from "@/api/trpc";
import { country } from "@routers/country";
import { paymentStatus } from "@routers/paymentStatus";
import { role } from "@routers/role";

export const appRouter = createTRPCRouter({
  role,
  country,
  paymentStatus,
});

export type AppRouter = typeof appRouter;
