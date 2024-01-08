import { type ScheduleListOuput } from "@/api/routers/schedule";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Tooltip } from "antd";
import dayjs from "dayjs";

type Props = { data?: ScheduleListOuput };

export default function Appointment({ data }: Props) {
  return (
    <section className="space-y-5">
      <section className="flex justify-between items-center">
        <h5 className="">Appointments</h5>
        <Tooltip title="Add an appointment for unlisted Doctor" placement="bottom">
          <Button type="primary" icon={<PlusOutlined />}>
            Assign an appointment
          </Button>
        </Tooltip>
      </section>
      {data && data?.length > 0 ? (
        data?.map((doctor) => (
          <section key={doctor?.doctor?.id}>
            <h6>
              {doctor?.doctor?.first_name} {doctor?.doctor?.last_name}
            </h6>
            <ul className="flex items-center gap-5">
              {doctor?.schedules?.map((time, index: number) => (
                <li key={index} className="shadow-md rounded-lg px-4 py-2">
                  {dayjs(time).format("HH:mm")}
                </li>
              ))}
              <Button type="primary" icon={<PlusOutlined />} onClick={() => console.log("asd")} />
            </ul>
          </section>
        ))
      ) : (
        <section className="py-5">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </section>
      )}
    </section>
  );
}
