import { createTRPCRouter } from "@/api/trpc";
import { user } from "./routers/user";

export const appRouter = createTRPCRouter({
  user,
});

export type AppRouter = typeof appRouter;
