import { type RouterInputs, type RouterOutputs } from "@/types";
import { schema, type ScheduleStatus } from "@schema/schemas";
import { type DateTime, type PaginationResponse, type Schedule } from "@schema/types";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { getData, postData } from "./shared";

type TUserInfo = {
  id: number;
  first_name: string;
  last_name: string;
};

export type TUpdatedData = {
  doctor: TUserInfo;
  schedules: Date[];
  hospital_id: number;
  doctor_id: number;
  patient_id: number;
  admin_id: number;
  is_admin_approved: boolean;
  is_doctor_approved: boolean;
  status: ScheduleStatus;
};

export const schedule = createTRPCRouter({
  list: protectedProcedure.input(schema.schedule.list).query(async ({ input }) => {
    type Response = {
      schedules: (Schedule & { patient: TUserInfo; admin: TUserInfo; doctor: TUserInfo; hospital_id: number })[];
    } & PaginationResponse;

    const data = (await getData({ endpoint: "/schedules", params: input })) as Response;

    const updatedData: TUpdatedData[] = [];

    data.schedules.forEach((schedule) => {
      const existingDoctor = updatedData.find((item) => item.doctor.id === schedule.doctor.id);

      if (existingDoctor) {
        existingDoctor.schedules.push(schedule.date_time);
      } else
        updatedData.push({
          doctor: schedule.doctor,
          doctor_id: schedule.doctor_id,
          patient_id: schedule.patient_id,
          admin_id: schedule.admin_id,
          hospital_id: schedule.hospital_id,
          is_admin_approved: schedule.is_admin_approved,
          is_doctor_approved: schedule.is_doctor_approved,
          status: schedule.status,
          schedules: [schedule.date_time],
        });
    });

    return updatedData;
  }),

  create: protectedProcedure.input(schema.schedule.create).mutation(async ({ input }) => {
    const data = await postData({ endpoint: `/schedules`, body: input.body });
    return data as Schedule & DateTime;
  }),
});

// outputs
export type ScheduleListOuput = RouterOutputs["schedule"]["list"];
export type ScheduleCreateOutput = RouterOutputs["schedule"]["create"];

// inputs
export type ScheduleListInput = RouterInputs["schedule"]["list"];
export type ScheduleCreateInput = RouterInputs["schedule"]["create"];
