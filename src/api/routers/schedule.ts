import { type RouterInputs, type RouterOutputs } from "@/types";
import { type Schedule } from "@schema/types";
import { schema } from "../schema/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getData } from "./shared";

export const schedule = createTRPCRouter({
  list: protectedProcedure.input(schema.schedule.list).query(async ({ input }) => {
    type Response = {
      schedules: (Schedule & {
        patient: {
          id: number;
          first_name: string;
          last_name: string;
        };
        admin: {
          id: number;
          first_name: string;
          last_name: string;
        };
        doctor: {
          id: number;
          first_name: string;
          last_name: string;
        };
      })[];
      totalPage: number;
    };
    const data = (await getData({ endpoint: "/schedules", params: input })) as Response;
    return data;
  }),
});

// outputs
export type ScheduleListOuput = RouterOutputs["schedule"]["list"];

// inputs
export type ScheduleListInput = RouterInputs["schedule"]["list"];
