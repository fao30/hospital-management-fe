import { type ScheduleListOuput, type ScheduleListOuputItem } from "@/api/routers/schedule";
import InputSelect from "@/components/InputSelect";
import { api } from "@/trpc/react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { useDebounce } from "@uidotdev/usehooks";
import { Button, DatePicker, Empty, Modal, Select, Spin, TimePicker, Tooltip, type DatePickerProps } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

dayjs.extend(customParseFormat);
dayjs.extend(utc);

type Props = {
  data?: ScheduleListOuput;
  date_picked?: string;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

export default function Appointment({ date_picked, data, isEdit, setIsEdit }: Props) {
  const utils = api.useUtils();
  const [isSelected, setIsSelected] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<Dayjs | null>(null);

  const addSchedule = api.schedule.create.useMutation({
    onSuccess: async () => {
      await utils.schedule.invalidate();
      setIsEdit(false);
      setTimeValue(null);
    },
  });

  const onChange = (time: Dayjs | null) => {
    setTimeValue(time);
  };

  const toggleAddButton = (index: number) => {
    setIsSelected(index);
    setIsEdit(true);
  };

  const handleAddMutation = (doctor: ScheduleListOuputItem) => {
    const doctorId = doctor?.doctor?.id;
    data?.find((doctor2) => {
      if (doctor2?.doctor_id === doctorId) {
        const getDatePicked = date_picked;
        const getTimePicked = dayjs(timeValue).toDate();

        const formattedDatePicked = dayjs(getDatePicked).format("YYYY-MM-DD");
        const formattedTimePicked = dayjs(getTimePicked).format("HH:mm:ss.SSS Z");

        const dateTime = new Date(`${formattedDatePicked} ${formattedTimePicked}`);

        addSchedule.mutate({
          body: {
            hospital_id: doctor.hospital_id,
            doctor_id: doctor.doctor_id,
            patient_id: doctor.patient_id,
            admin_id: doctor.admin_id,
            is_admin_approved: doctor.is_admin_approved,
            is_doctor_approved: doctor.is_doctor_approved,
            status: doctor.status,
            date_time: dayjs(dateTime).tz("GMT").format("YYYY-MM-DD HH:mm:ss.SSS Z"),
          },
        });
      }
    });
  };

  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [doctorSearch, setDoctorSearch] = useState<string>("");
  const debouncedPatientSearch = useDebounce(doctorSearch, 500);

  const { data: doctors, isFetching: loadingDoctors } = api.user.search.useQuery(
    { role_id: 4, key_words: debouncedPatientSearch },
    { enabled: !!debouncedPatientSearch },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    console.log("CHECKK >", selectedDoctor);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onOkDP = (value: DatePickerProps["value"]) => {
    console.log("onOk: ", dayjs(value).format("YYYY-MM-DD,HH:mm"));
  };

  const onChangeDP = (value: DatePickerProps["value"], dateString: [string, string] | string) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };

  return (
    <section className="space-y-5">
      <section className="flex justify-between items-center">
        <h5 className="">Appointments</h5>
        <Tooltip title="Add an appointment for unlisted Doctor" placement="bottom">
          <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
            Assign an appointment
          </Button>
        </Tooltip>
        <Modal
          title="Manage Doctor's Calendar"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="primary"
              // loading={loading}
              onClick={handleOk}
            >
              Submit
            </Button>,
          ]}
        >
          <section className="grid gap-5">
            <section>
              <p>Search Doctor</p>
              <InputSelect
                onChange={(e) => setSelectedDoctor(e as string)}
                onSearch={(e) => setDoctorSearch(e)}
                notFoundContent={
                  loadingDoctors ? (
                    <section className="flex justify-center items-center py-4">
                      <Spin size="small" />
                    </section>
                  ) : (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  )
                }
                showSearch={true}
                placeholder="Dr. Abdur Rohim"
                options={doctors?.search.map((doctor) => ({
                  value: doctor?.id,
                  label: `${doctor?.first_name} ${doctor?.last_name}`,
                }))}
              />
            </section>
            <section>
              <p>Select Date</p>
              <DatePicker
                className="w-full"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={onChangeDP}
                onOk={onOkDP}
                placeholder="2024-01-01 22:22"
              />
            </section>
          </section>
        </Modal>
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
                    if (selected) {
                      console.log("TRIGGER");
                      handleAddMutation(doctor);
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
