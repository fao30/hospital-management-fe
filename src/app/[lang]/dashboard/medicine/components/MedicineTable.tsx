import { type MedicineListOuput } from "@/api/routers/medicine";
import { type VisitListInput } from "@/api/routers/visit";
import { type Medicine } from "@/api/schema/types";
import Button from "@/components/Button";
import FilterIcon from "@/components/FilterIcon";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { useStore } from "@/global/store";
import { ICONS, PAGINATION_LIMIT } from "@/lib/constants";
import { cn, createUrl, formatCurrency, formatDate } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { type SearchParams } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { Table } from "antd";
import { type FilterDropdownProps } from "antd/es/table/interface";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type Props = {
  data?: MedicineListOuput;
  loading: boolean;
  query: VisitListInput;
  searchParams: SearchParams;
  handleEdit: (data: Medicine) => void;
};

export default function MedicineTable({ data, loading, query, searchParams, handleEdit }: Props) {
  const { lang } = useStore();
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(`/${lang}/dashboard/medicine`, newParams));
  };

  const getTableFilter = ({
    name,
    icon,
    type,
  }: {
    name: string; // TBU
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
      dataSource={data?.medicines}
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
          title: "Action",
          key: "id",
          width: 1,
          render: (_, e) => (
            <section className="flex justify-center items-center">
              <Iconify icon={ICONS.edit} color={COLORS.blue} onClick={() => handleEdit(e)} />
            </section>
          ),
        },
        {
          title: "Name",
          key: "name",
          dataIndex: "name",
        },
        {
          title: "Price",
          key: "price",
          dataIndex: "price",
          align: "right",
          render: (price: number, item) => formatCurrency({ amount: price, currency: item.currency }),
        },
        {
          title: "Manufacturer",
          key: "manufacturer",
          dataIndex: "manufacturer",
        },
        {
          title: "In Stock",
          key: "in_stock",
          dataIndex: "in_stock",
        },
        {
          title: "Article Number",
          key: "article_number",
          dataIndex: "article_number",
        },
        {
          title: "Expiry Date",
          key: "expiry_date",
          dataIndex: "expiry_date",
          render: (date: Date) => formatDate({ date, style: "short" }),
        },
      ]}
    />
  );
}
