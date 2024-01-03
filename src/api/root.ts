import { createTRPCRouter } from "@/api/trpc";
import { country } from "@routers/country";
import { paymentStatus } from "@routers/paymentStatus";
import { role } from "@routers/role";
import { user } from "@routers/user";

export const appRouter = createTRPCRouter({
  role,
  country,
  paymentStatus,
  user,
});

export type AppRouter = typeof appRouter;
