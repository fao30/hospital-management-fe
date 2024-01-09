* eslint - disable @typescript-eslint / no - unsafe - call * /
"use client";

import { Fragment, useEffect } from "react";
import io from 'socket.io-client';


export default function VisitSocket() {

  useEffect(() => {
    const socket = io('wss://fao-med.faotech.dev:3003'); // Update with your server URL

    socket.on('connect', () => {
      console.log("EHEHEHHE-------->>>>>>>>>>>>>>>>");

      console.log('Connected to Socket.IO');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
    });

    return () => {
      // Clean up the socket connection when the component unmounts
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