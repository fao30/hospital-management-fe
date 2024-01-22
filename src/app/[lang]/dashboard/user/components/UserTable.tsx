import { type UserListInput, type UserListOutput } from "@/api/routers/user";
import { ROLES } from "@/api/schema/constants";
import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Input from "@/components/Input";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { cn, createUrl, localizePhoneNumber } from "@/lib/functions";
import { type Lang, type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { useRouter } from "next/navigation";

type Props = {
  data?: UserListOutput;
  loading: boolean;
  lang: Lang;
  query: UserListInput;
  searchParams: SearchParams;
};

export default function UserTable({ data, loading, lang, query, searchParams }: Props) {
  const router = useRouter();
  const newParams = new URLSearchParams(searchParams);

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(`/${lang}/dashboard/user`, newParams));
  };

  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: keyof UserListInput;
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
      dataSource={data?.users}
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
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
      }}
      onChange={(pagination) => {
        if (pagination.current === 1) {
          newParams.delete("page");
        } else newParams.set("page", String(pagination.current));
        redirectTable(newParams);
      }}
      columns={[
        {
          title: "Full Name",
          key: "fullName",
          render: (_, item) => `${item?.first_name} ${item.last_name}`,
        },
        {
          title: "Role",
          key: "role",
          render: (_, item) => ROLES.find((e) => e.id === item.role_id)?.label,
        },
        {
          title: "Phone Number",
          key: "phone_number",
          dataIndex: "phone_number",
          render: (text: string) => localizePhoneNumber(text),
        },
        {
          title: "Email",
          key: "email",
          dataIndex: "email",
        },
      ]}
    />
  );
}
