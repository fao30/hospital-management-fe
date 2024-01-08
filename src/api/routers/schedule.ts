import { type RouterInputs, type RouterOutputs } from "@/types";
import { type PaginationResponse, type Schedule } from "@schema/types";
import { schema } from "../schema/schemas";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getData } from "./shared";

export const schedule = createTRPCRouter({
  list: protectedProcedure.input(schema.schedule.list).query(async ({ input }) => {
    type UserInfo = { id: number; first_name: string; last_name: string };
    type Response = { schedules: (Schedule & { patient: UserInfo; admin: UserInfo; doctor: UserInfo })[] } & PaginationResponse;

    const data = (await getData({ endpoint: "/schedules", params: input })) as Response;

    const updatedData: {
      doctor: UserInfo;
      schedules: Date[];
    }[] = [];

    data.schedules.forEach((schedule) => {
      const existingDoctor = updatedData.find((item) => item.doctor.id === schedule.doctor.id);

      if (existingDoctor) {
        existingDoctor.schedules.push(schedule.date_time);
      } else updatedData.push({ doctor: schedule.doctor, schedules: [schedule.date_time] });
    });

    return updatedData;
  }),
});

// outputs
export type ScheduleListOuput = RouterOutputs["schedule"]["list"];

// inputs
export type ScheduleListInput = RouterInputs["schedule"]["list"];
