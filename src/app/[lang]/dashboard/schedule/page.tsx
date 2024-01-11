"use client";

import { type ScheduleListInput } from "@/api/routers/schedule";
import { getInputDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Fragment, useEffect, useState } from "react";
import Appointment from "./components/Appointment";

dayjs.extend(utc);
dayjs.extend(timezone);

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
    const gmtTime = dayjs(newValue).tz('GMT');
    setQuery({
      ...query,
      date_time: newValue.format("YYYY-MM-DD"),
      from_date_time: gmtTime.format("YYYY-MM-DD HH:mm:ss.SSS Z"),
      to_date_time: gmtTime.add(24, 'hours').format("YYYY-MM-DD HH:mm:ss.SSS Z")
    });
    setIsEdit(false);
  };

  useEffect(() => {
    onSelect(dayjs(getInputDate()))
  }, []);

  return (
    <Fragment>
      <Calendar value={dayjs(query.date_time)} onSelect={onSelect} />
      <Appointment
        date_picked={dayjs(query?.date_time).format("YYYY-MM-DD HH:mm:ss.SSS Z")}
        data={data}
        isEdit={isEdit}
        setIsEdit={setIsEdit} />
    </Fragment>
  );
}
