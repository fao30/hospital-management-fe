"use client";

import { type ScheduleListOuputItem } from "@/api/routers/schedule";
import { useStore } from "@/global/store";
import { type Session } from "next-auth";
import { Fragment, useEffect } from "react";
import io from "socket.io-client";
import { toastSuccess } from "./Toast";

type Props = { session: Session };

export default function Socket({ session }: Props) {
  const { t } = useStore();

  useEffect(() => {
    const socket = io("wss://fao-med.faotech.dev", {
      path: "/socket.io/",
      transports: ["websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("CONNECT WEBSOCKET!!");
    });

    socket.on("schedule", (data: { schedule: ScheduleListOuputItem }) => {
      if (data?.schedule?.doctor_id === session?.user?.id) {
        toastSuccess({ t, description: "ADA APPOINTMENT UNTUK MU DOKTER" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("error", (error) => {
      console.error("WebSocket error", error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <Fragment></Fragment>;
}
