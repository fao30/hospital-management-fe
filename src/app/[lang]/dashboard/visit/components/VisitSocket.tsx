"use client";

import { Fragment, useEffect } from "react";
import io from 'socket.io-client';


export default function VisitSocket() {

  useEffect(() => {
    const socket = io("wss://fao-med.faotech.dev", {
      path: "/socket.io/",
      transports: ["websocket"],
      autoConnect: true
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
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
      <article className="flex flex-col gap-6">
        <section className="flex justify-end">
          {/* <Button size="small" rounded="md">
            Add Visit
          </Button> */}
        </section>

      </article>
    </Fragment>
  );
}