import { type VisitListOuput } from "@/api/routers/visit";
import { formatDate, localizePhoneNumber } from "@/lib/functions";
import { type Lang } from "@/types";
import { Table } from "antd";

type Props = {
  data?: VisitListOuput;
  loading: boolean;
  lang: Lang;
};

export default function VisitTable({ data, loading, lang }: Props) {
  return (
    <Table
      rowKey="id"
      loading={loading}
      dataSource={data?.visits}
      pagination={{}}
      columns={[
        {
          title: "Hospital",
          key: "hospital",
          render: (_, item) => item?.Hospital?.name,
        },
        {
          title: "Name",
          key: "name",
          render: (_, item) => `${item?.User?.first_name} ${item.User?.last_name}`,
        },
        {
          title: "Phone Number",
          key: "phoneNumber",
          render: (_, item) => localizePhoneNumber(item?.User?.phone_number),
        },
        {
          title: "Start",
          key: "date_start",
          dataIndex: "date_start",
          render: (date: Date) => date && formatDate({ date, lang, style: "short" }),
        },
        {
          title: "End",
          key: "date_end",
          dataIndex: "date_end",
          render: (date: Date) => date && formatDate({ date, lang, style: "short" }),
        },
        {
          title: "Temperature",
          key: "temperature",
          dataIndex: "temperature",
          render: (text: number) => `${text} °C`,
        },
      ]}
    />
  );
}
