import { cn } from "@/lib/functions";
import dayjs from "dayjs";

const SCHEDULE_RANGE = [
  { label: "08:00" },
  { label: "", value: "09:00" },
  { label: "10:00", value: "10:00" },
  { label: "", value: "11:00" },
  { label: "12:00", value: "12:00" },
  { label: "", value: "13:00" },
  { label: "14:00", value: "14:00" },
  { label: "", value: "15:00" },
  { label: "16:00", value: "16:00" },
  { label: "", value: "17:00" },
  { label: "18:00", value: "18:00" },
  { label: "", value: "19:00" },
  { label: "20:00", value: "20:00" },
  { label: "", value: "21:00" },
  { label: "22:00", value: "22:00" },
];

export default function PlaygroundPage() {
  return (
    <article className="flex flex-col divide-y-1 divide-black border border-black">
      <section className="p-4 bg-gray/10">
        <section className="flex items-center justify-evenly">
          <section className="flex gap-2 items-center">
            <div className="shadow bg-purple-500/60 size-4 rounded-full border-1 border-white" />
            <p>Dr. Ryan</p>
          </section>
          <section className="flex gap-2 items-center">
            <div className="shadow bg-indigo-500/60 size-4 rounded-full border-1 border-white" />
            <p>Dr. Firly</p>
          </section>
          <section className="flex gap-2 items-center">
            <div className="shadow bg-cyan-500/60 size-4 rounded-full border-1 border-white" />
            <p>Dr. Zidni</p>
          </section>
        </section>
      </section>

      <section className="p-4 grid grid-cols-10 gap-4">
        <p>Day</p>
        <p>Date</p>
        <section className="col-span-8">
          <section className="grid grid-cols-15">
            {SCHEDULE_RANGE.map((e, index) => (
              <section key={e.value} className="flex flex-col justify-between items-center gap-2 relative">
                <p>{e.label}</p>
                <div className="h-2 w-0.5 bg-blue z-10" />
                <div
                  className={cn("w-full flex absolute bottom-[0.175rem]", {
                    "justify-end": index === 0,
                    "justify-start": index === SCHEDULE_RANGE.length - 1,
                  })}
                >
                  <div
                    className={cn("w-full h-0.5 bg-gray", {
                      "w-[50%]": index === 0 || index === SCHEDULE_RANGE.length - 1,
                    })}
                  />
                </div>
              </section>
            ))}
          </section>
        </section>
      </section>

      {Array(7)
        .fill(7)
        .map((_, i) => (
          <section className="p-4 grid grid-cols-10 gap-4">
            <p>{dayjs().add(i, "day").format("dddd")}</p>
            <p>{dayjs().add(i, "day").format("DD.MM.YYYY")}</p>
          </section>
        ))}
    </article>
  );
}
