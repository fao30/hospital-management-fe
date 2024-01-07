"use client";

import { type ScheduleListInput } from "@/api/routers/schedule";
import { api } from "@/trpc/react";
import { Fragment, useState } from "react";

export default function SchedulePage() {
  const [query, setQuery] = useState<ScheduleListInput>({
    page: 0,
    limit: 50,
    date_time: "2024-01-06",
    sort_doctor_id: "ASC",
  });

  const { data } = api.schedule.list.useQuery(query);

  return <Fragment>Schedule</Fragment>;
}
