import { createTRPCRouter } from "@/api/trpc";
import { country } from "@routers/country";
import { hospital } from "@routers/hospital";
import { medicine } from "@routers/medicine";
import { medicineTreatment } from "@routers/medicineTreatment";
import { paymentStatus } from "@routers/paymentStatus";
import { price } from "@routers/price";
import { role } from "@routers/role";
import { schedule } from "@routers/schedule";
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
  medicineTreatment,
  treatment,
  schedule,
  price,
});

export type AppRouter = typeof appRouter;
