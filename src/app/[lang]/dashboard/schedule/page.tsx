"use client";

import { type ScheduleListInput } from "@/api/routers/schedule";
import { formatDate } from "@/lib/functions";
import { api } from "@/trpc/react";
import { type Lang } from "@/types";
import { Calendar } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useState } from "react";

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

  const { data } = api.schedule.list.useQuery(query);

  const onSelect = (newValue: Dayjs) => {
    setQuery({ ...query, date_time: newValue.format("YYYY-MM-DD") });
  };

  return (
    <>
      <Calendar value={dayjs(query.date_time)} onSelect={onSelect} />
      {data?.map((doctor) => (
        <>
          <p>{doctor?.doctor?.first_name}</p>
          {doctor?.schedules?.map((schedule) => (
            <p>{formatDate({ date: schedule, style: "long", withTime: true, lang: params.lang })}</p>
          ))}
        </>
      ))}
    </>
  );
}
