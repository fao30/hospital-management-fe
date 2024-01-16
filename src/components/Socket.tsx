"use client";

import { Fragment, useEffect } from "react";
import io from "socket.io-client";
import { toastSuccess } from "./Toast";
import { useStore } from "@/global/store";
import { type DefaultSession } from "next-auth";
import { type ScheduleListOuputItem } from "@/api/routers/schedule";


export default function Socket({ session_data }: { session_data: DefaultSession }) {
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

    socket.on('schedule', (data: ScheduleListOuputItem) => {
      if (data?.schedule?.doctor_id === session_data?.user?.id) {
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
