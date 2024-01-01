import ClientComponent from "@/components/ClientComponent";
import ServerComponents from "@/components/ServerComponents";
import { Fragment } from "react";

export default function HomePage() {
  return (
    <Fragment>
      <ClientComponent />
      <ServerComponents />
    </Fragment>
  );
}
