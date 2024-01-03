import { role } from "@/api/routers/role";
import { createTRPCRouter } from "@/api/trpc";

export const appRouter = createTRPCRouter({
  role,
});

export type AppRouter = typeof appRouter;
