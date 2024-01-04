import { createTRPCRouter } from "@/api/trpc";
import { country } from "@routers/country";
import { hospital } from "@routers/hospital";
import { medicine } from "@routers/medicine";
import { paymentStatus } from "@routers/paymentStatus";
import { role } from "@routers/role";
import { treatment } from "@routers/treatment";
import { user } from "@routers/user";
import { visit } from "@routers/visit";

export const appRouter = createTRPCRouter({
  role,
  country,
  paymentStatus,
  user,
  hospital,
  visit,
  medicine,
  treatment,
});

export type AppRouter = typeof appRouter;
