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

    console.log(data);

    const receipt: {
      doctor: {
        id: number;
        first_name: string;
        last_name: string;
      };
      schedules: Date[];
    }[] = [];

    data.schedules.forEach((schedule) => {
      const existingDoctor = receipt.find((item) => item.doctor.id === schedule.doctor.id);

      if (existingDoctor) {
        existingDoctor.schedules.push(schedule.date_time);
      } else {
        receipt.push({
          doctor: schedule.doctor,
          schedules: [schedule.date_time],
        });
      }
    });

    return receipt;
  }),
});

// outputs
export type ScheduleListOuput = RouterOutputs["schedule"]["list"];

// inputs
export type ScheduleListInput = RouterInputs["schedule"]["list"];
