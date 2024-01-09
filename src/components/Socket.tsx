"use client";

import { Fragment, useEffect } from "react";
import io from 'socket.io-client';


export default function Socket() {

  useEffect(() => {
    const socket = io("wss://fao-med.faotech.dev", {
      path: "/socket.io/",
      transports: ["websocket"],
      autoConnect: true
    });

    socket.on("connect", () => {
      console.log("CONNECT WEBSOCKET!!");

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

  return (
    <Fragment>
    </Fragment>
  );
}