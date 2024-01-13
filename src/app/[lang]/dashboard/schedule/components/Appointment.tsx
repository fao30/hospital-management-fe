import { type ScheduleCreateInput, type ScheduleListOuput, type ScheduleListOuputItem } from "@/api/routers/schedule";
import { schema } from "@/api/schema/schemas";
import Button from "@/components/Button";
import InputSelect from "@/components/InputSelect";
import { Modal } from "@/components/Modal";
import { toastError } from "@/components/Toast";
import { useStore } from "@/global/store";
import { api } from "@/trpc/react";
import { CheckOutlined, PlusOutlined } from "@ant-design/icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@uidotdev/usehooks";
import { Button as ButtonAntd, Checkbox, DatePicker, Empty, Select, Spin, TimePicker, Tooltip } from "antd";
import dayjs, { type Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState, type Dispatch, type SetStateAction } from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";

dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(utc);

type Props = {
  data?: ScheduleListOuput;
  date_picked?: string;
  isEdit: boolean;
  setIsEdit: Dispatch<SetStateAction<boolean>>;
};

export default function Appointment({ date_picked, data, isEdit, setIsEdit }: Props) {
  const { t } = useStore();

  const utils = api.useUtils();
  const [isSelected, setIsSelected] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<Dayjs | null>(null);
  const [showModal, setShowModal] = useState(false);
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    clearErrors,
  } = useForm<ScheduleCreateInput>({
    resolver: zodResolver(schema.schedule.create),
    defaultValues: { body: { status: "SCHEDULED", is_admin_approved: false, is_doctor_approved: false, hospital_id: 0 } },
  });
  // console.log(schema.schedule.create.safeParse(watch()));

  const { mutate: createSchedule, isLoading: loading } = api.schedule.create.useMutation({
    onSuccess: async () => {
      await utils.schedule.invalidate();
      setIsEdit(false);
      setTimeValue(null);
      setShowModal(false);
      reset();
    },
    onError: () => {
      toastError({ t, description: "Server Error" });
    },
  });

  const handleChangeTimePicker = (time: Dayjs | null) => {
    setTimeValue(time);
  };

  const toggleAddButton = (index: number) => {
    setIsSelected(index);
    setIsEdit(true);
  };

  const handleAddTime = (doctor: ScheduleListOuputItem) => {
    const doctorId = doctor?.doctor?.id;
    data?.find((doctor2) => {
      if (doctor2?.doctor_id === doctorId) {
        const getDatePicked = date_picked;
        const getTimePicked = dayjs(timeValue).toDate();

        const formattedDatePicked = dayjs(getDatePicked).format("YYYY-MM-DD");
        const formattedTimePicked = dayjs(getTimePicked).format("HH:mm:ss.SSS Z");

        const dateTime = new Date(`${formattedDatePicked} ${formattedTimePicked}`);

        createSchedule({
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

  const [doctorSearch, setDoctorSearch] = useState<string>("");
  const debouncedDoctorSearch = useDebounce(doctorSearch, 500);
  const { data: doctors, isFetching: loadingDoctors } = api.user.search.useQuery(
    { role_id: 4, key_words: debouncedDoctorSearch },
    { enabled: !!debouncedDoctorSearch },
  );

  const [patientSearch, setPatientSearch] = useState<string>("");
  const debouncedPatientSearch = useDebounce(patientSearch, 500);
  const { data: patients, isFetching: loadingPatients } = api.user.search.useQuery(
    { role_id: 5, key_words: debouncedPatientSearch },
    { enabled: !!debouncedPatientSearch },
  );

  const onSubmit: SubmitHandler<ScheduleCreateInput> = (data) => {
    createSchedule(data);
  };

  const closeModal = () => {
    setShowModal(false);
    reset();
  };

  return (
    <section className="space-y-5">
      <section className="flex justify-between items-center">
        <h5 className="">Appointments</h5>
        <Tooltip title="Add an appointment for unlisted Doctor" placement="bottom">
          <ButtonAntd type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
            Assign an appointment
          </ButtonAntd>
        </Tooltip>
        <Modal show={showModal} closeModal={closeModal}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 w-96">
            <Controller
              control={control}
              name="body.doctor_id"
              render={({ field }) => (
                <InputSelect
                  {...field}
                  error={errors?.body?.doctor_id?.message}
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
                  placeholder="Search Doctor"
                  options={doctors?.search.map((doctor) => ({
                    value: doctor?.id,
                    label: `${doctor?.first_name} ${doctor?.last_name}`,
                  }))}
                />
              )}
            />
            <section>
              <Controller
                control={control}
                name="body.patient_id"
                render={({ field }) => (
                  <InputSelect
                    {...field}
                    error={errors?.body?.patient_id?.message}
                    onSearch={(e) => setPatientSearch(e)}
                    notFoundContent={
                      loadingPatients ? (
                        <section className="flex justify-center items-center py-4">
                          <Spin size="small" />
                        </section>
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )
                    }
                    showSearch={true}
                    placeholder="Seach Patient"
                    options={patients?.search.map((patient) => ({
                      value: patient?.id,
                      label: `${patient?.first_name} ${patient?.last_name}`,
                    }))}
                  />
                )}
              />
            </section>
            <section>
              <DatePicker
                className="w-full"
                showTime={{ format: "HH:mm" }}
                format="YYYY-MM-DD HH:mm"
                onChange={(e) => {
                  setValue("body.date_time", dayjs(e).tz("GMT").format("YYYY-MM-DD HH:mm:ss.SSS Z"));
                  clearErrors("body.date_time");
                }}
                placeholder="2024-01-01 22:22"
              />
            </section>
            <section>
              <Controller
                control={control}
                name="body.status"
                render={({ field }) => (
                  <Select
                    defaultValue="Scheduled"
                    className="w-full"
                    {...field}
                    options={[
                      { value: "SCHEDULED", label: "Scheduled" },
                      { value: "NOT_SHOW", label: "Not show" },
                      { value: "DONE", label: "Done" },
                      { value: "CANCELLED", label: "Cancelled" },
                    ]}
                  />
                )}
              />
            </section>
            <Controller
              control={control}
              name="body.is_doctor_approved"
              render={({ field }) => <Checkbox {...field}>Approved by Doctor</Checkbox>}
            />
            <Controller
              control={control}
              name="body.is_admin_approved"
              render={({ field }) => <Checkbox {...field}>Approved by Admin</Checkbox>}
            />
            <Button loading={loading} type="submit">
              Create Price
            </Button>
          </form>
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
                {selected && <TimePicker value={timeValue} onChange={handleChangeTimePicker} format={"HH:mm"} />}
                <ButtonAntd
                  type="primary"
                  icon={selected ? <CheckOutlined /> : <PlusOutlined />}
                  loading={loading && selected}
                  onClick={() => {
                    toggleAddButton(index);
                    if (selected) {
                      handleAddTime(doctor);
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
