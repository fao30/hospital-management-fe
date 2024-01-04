import { createTRPCRouter } from "@/api/trpc";
import { country } from "@routers/country";
import { hospital } from "@routers/hospital";
import { paymentStatus } from "@routers/paymentStatus";
import { role } from "@routers/role";
import { user } from "@routers/user";
import { visit } from "@routers/visit";

export const appRouter = createTRPCRouter({
  role,
  country,
  paymentStatus,
  user,
  hospital,
  visit,
});

export type AppRouter = typeof appRouter;
