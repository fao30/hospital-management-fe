import { type VisitListInput, type VisitListOutput } from "@/api/routers/visit";
import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Input from "@/components/Input";
import { useStore } from "@/global/store";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { cn, createUrl, formatDate, localizePhoneNumber } from "@/lib/functions";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  data?: VisitListOutput;
  loading: boolean;
  query: VisitListInput;
  searchParams: SearchParams;
};

export default function VisitTable({ data, loading, query, searchParams }: Props) {
  const { lang } = useStore();
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(`/${lang}/dashboard/visit`, newParams));
  };

  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof VisitListInput;
    icon?: IconifyIcon | string;
    type?: React.HTMLInputTypeAttribute;
  }) => ({
    filterDropdown: ({ confirm }: FilterDropdownProps) => {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = e.target as HTMLFormElement;
            const value = val[name] as HTMLInputElement;
            if (value.value) {
              newParams.set(name, value.value);
            } else newParams.delete(name);
            confirm();
            redirectTable(newParams);
          }}
          className="flex flex-col gap-2 w-52 bg-light p-2 rounded-md shadow"
        >
          <Input
            icon={icon}
            key={name}
            defaultValue={searchParams[name]}
            name={name}
            type={type ? type : "text"}
            className={cn("text-base")}
          />
          <section className="grid grid-cols-2 gap-2">
            <Button size="small" color="primary" type="submit">
              Search
            </Button>
            <Button
              size="small"
              color="disabled"
              onClick={(e) => {
                const form = e.currentTarget.form!;
                if (form) {
                  form.reset();
                  if (!searchParams[name]) return;
                }
                newParams.delete(name);
                newParams.delete("page");
                confirm();
                redirectTable(newParams);
              }}
            >
              Reset
            </Button>
          </section>
        </form>
      );
    },
    filterIcon: () => <FilterIcon name={name} searchParams={searchParams} />,
  });

  return (
    <Table
      scroll={{ x: "max-content" }}
      rowKey="id"
      loading={loading}
      dataSource={data?.visits}
      onChange={(pagination) => {
        if (pagination.current === 1) {
          newParams.delete("page");
        } else newParams.set("page", String(pagination.current));
        redirectTable(newParams);
      }}
      pagination={{
        current: query?.page,
        pageSize: query?.limit,
        total: data?.count,
        showSizeChanger: true,
        pageSizeOptions: [String(PAGINATION_LIMIT), "75", "100"],
        onChange: (_, limit) => {
          if (limit === PAGINATION_LIMIT) {
            newParams.delete("limit");
          } else newParams.set("limit", String(limit));
          redirectTable(newParams);
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} visits`,
      }}
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
          title: "Date",
          key: "createdAt",
          dataIndex: "createdAt",
          render: (date: Date) => formatDate({ lang, date, style: "short" }),
          ...getTableFilter({ name: "createdAt", type: "date" }),
        },
        {
          title: "Start",
          key: "date_start",
          dataIndex: "date_start",
          render: (date: Date) => date && formatDate({ date, lang, style: "short", withTime: true }),
        },
        {
          title: "End",
          key: "date_end",
          dataIndex: "date_end",
          render: (date: Date) => date && formatDate({ date, lang, style: "short", withTime: true }),
        },
      ]}
    />
  );
}
