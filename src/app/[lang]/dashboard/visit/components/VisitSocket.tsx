"use client";

import { Fragment, useEffect } from "react";
import io from 'socket.io-client';


export default function VisitSocket() {

  useEffect(() => {
    // const socket = io("ws://fao-med.faotech.dev:3003");

    // socket.on("connect", () => {
    //   console.log("Connected to WebSocket server");
    // });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from WebSocket server");
    // });

    // socket.on("error", (error) => {
    //   console.error("WebSocket error:", error);
    // });

    // return () => {
    //   // Clean up the socket connection when the component unmounts
    //   socket.disconnect();
    // };
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