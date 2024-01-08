"use client";

import { type ScheduleListInput } from "@/api/routers/schedule";
import { getInputDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import Appointment from "./components/Appointment";

export default function SchedulePage() {
  const [query, setQuery] = useState<ScheduleListInput>({
    page: 0,
    limit: 9999,
    date_time: getInputDate(),
    sort_doctor_id: "ASC",
  });
  const { data } = api.schedule.list.useQuery(query);

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const onSelect = (newValue: Dayjs) => {
    setQuery({ ...query, date_time: newValue.format("YYYY-MM-DD") });
    setIsEdit(false);
  };

  return (
    <Fragment>
      <Calendar value={dayjs(query.date_time)} onSelect={onSelect} />
      <Appointment data={data} isEdit={isEdit} setIsEdit={setIsEdit} />
    </Fragment>
  );
}
