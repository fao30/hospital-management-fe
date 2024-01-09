import { type ScheduleListOuput } from "@/api/routers/schedule";
import { api } from "@/trpc/react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, TimePicker, Tooltip } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

type Props = {
  data?: ScheduleListOuput;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

export default function Appointment({ data, isEdit, setIsEdit }: Props) {
  const utils = api.useUtils();
  const [isSelected, setIsSelected] = useState<number>(0);

  const addSchedule = api.schedule.create.useMutation({
    onSuccess: async () => {
      console.log("TRIGG");
      await utils.schedule.invalidate();
      setIsEdit(false);
    },
  });

  const [timeValue, setTimeValue] = useState<Dayjs | null>(null);
  const onChange = (time: Dayjs | null) => {
    setTimeValue(time);
  };

  const toggleAddButton = (index: number) => {
    setIsSelected(index);
    setIsEdit(true);
  };

  useEffect(() => {
    console.log("isSelected >", isSelected);
  }, [isSelected]);

  useEffect(() => {
    console.log("isEdit >", isEdit);
  }, [isEdit]);

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
        data?.map((doctor, index: number) => {
          const selected = isSelected === index && isEdit;
          return (
            <section key={doctor?.doctor?.id}>
              <h6>
                {doctor?.doctor?.first_name} {doctor?.doctor?.last_name}
              </h6>
              <ul className={`flex flex-wrap items-center gap-5`}>
                {doctor?.schedules?.map((time, index: number) => (
                  <li key={index} className="shadow-md rounded-lg px-4 py-2">
                    {dayjs(time).format("HH:mm")}
                  </li>
                ))}
                {selected && <TimePicker value={timeValue} onChange={onChange} format={"HH:mm"} />}
                <Button
                  type="primary"
                  icon={selected ? <CheckOutlined /> : <PlusOutlined />}
                  loading={addSchedule.isLoading && selected}
                  onClick={() => {
                    toggleAddButton(index);
                    // console.log("KK >>", dayjs(selectedDate).utc().toString());
                    if (selected) {
                      const doctorId = doctor?.doctor?.id;
                      const selectedDoctor = data?.find((doc) => doc?.doctor?.id === doctorId)?.doctor_id;
                      console.log("selectedDoctor >", selectedDoctor, doctorId);
                      data?.find((doctor2, index: number) => {
                        console.log(">>", doctor2?.doctor_id, doctorId, doctor2?.doctor_id === doctorId);
                        if (doctor2?.doctor_id === doctorId) {
                          console.log("TRIGG HERE", index);
                          addSchedule.mutate({
                            body: {
                              hospital_id: doctor.hospital_id,
                              doctor_id: doctor.doctor_id,
                              patient_id: doctor.patient_id,
                              admin_id: doctor.admin_id,
                              is_admin_approved: doctor.is_admin_approved,
                              is_doctor_approved: doctor.is_doctor_approved,
                              status: doctor.status,
                              date_time: dayjs(timeValue).utc().toString(),
                            },
                          });
                        }
                      });
                    }
                  }}
                />
              </ul>
            </section>
          );
        })
      ) : (
        <section className="py-5">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </section>
      )}
    </section>
  );
}
