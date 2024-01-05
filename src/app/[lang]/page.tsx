import Link from "next/link";
import { Fragment } from "react";

export default async function HomePage() {
  return (
    <Fragment>
      <Link href="/dashboard">Dashboard</Link>
    </Fragment>
  );
}
