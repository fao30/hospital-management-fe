"use client";

import { type ScheduleListInput } from "@/api/routers/schedule";
import { type Lang } from "@/types";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";
import Appointment from "./components/Appointment";

type Props = {
  params: { lang: Lang };
};

export default function SchedulePage({ params }: Props) {
  const [query, setQuery] = useState<ScheduleListInput>({
    page: 0,
    limit: 50,
    date_time: "2024-01-10",
    sort_doctor_id: "ASC",
  });

  const onSelect = (newValue: Dayjs) => {
    setQuery({ ...query, date_time: newValue.format("YYYY-MM-DD") });
  };

  return (
    <>
      <Calendar value={dayjs(query.date_time)} onSelect={onSelect} />
      <Appointment query={query} />
    </>
  );
}
