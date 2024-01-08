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
  const [query, setQuery] = useState<ScheduleListInput & { queryKey: string }>({
    page: 0,
    limit: 9999,
    date_time: getInputDate(),
    sort_doctor_id: "ASC",
    queryKey: "scheduleList",
  });
  const { data } = api.schedule.list.useQuery(query);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedDate, setSelectedData] = useState<Dayjs | null>(null);

  const onSelect = (newValue: Dayjs) => {
    setQuery({ ...query, date_time: newValue.format("YYYY-MM-DD") });
    setSelectedData(dayjs(newValue).utc());
    console.log(">", dayjs(newValue).utc());
    setIsEdit(false);
  };

  return (
    <Fragment>
      <Calendar value={dayjs(query.date_time)} onSelect={onSelect} />
      <Appointment data={data} isEdit={isEdit} setIsEdit={setIsEdit} selectedDate={selectedDate} />
    </Fragment>
  );
}
