import { type PriceListInput, type PriceListOutput } from "@/api/routers/price";
import { type Price } from "@/api/schema/types";
import Iconify from "@/components/Iconify";
import Input from "@/components/Input";
import { useStore } from "@/global/store";
import { ICONS, PAGINATION_LIMIT } from "@/lib/constants";
import { cn, createUrl, formatDate, localizePhoneNumber } from "@/lib/functions";
import { COLORS } from "@/styles/theme";
import { type SearchParams } from "@/types";
import { Table } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  data?: PriceListOutput;
  loading: boolean;
  query: PriceListInput;
  searchParams: SearchParams;
  handleEdit: (data: Price) => void;
};

export default function PriceTable({ data, loading, query, searchParams, handleEdit }: Props) {
  const { lang } = useStore();
  const router = useRouter();
  const newSearchParams = useSearchParams();
  const newParams = new URLSearchParams(newSearchParams.toString());

  const redirectTable = (newParams: URLSearchParams) => {
    router.push(createUrl(`/${lang}/dashboard/price`, newParams));
  };

  return (
    <>
      <Table
        scroll={{ x: "max-content" }}
        loading={loading}
        dataSource={data?.list_prices}
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
                <Iconify width={20} icon={ICONS.edit} color={COLORS.blue} onClick={() => handleEdit(e)} />
              </section>
            ),
          },
          {
            title: "Treatment Name",
            key: "treatment_name",
            dataIndex: "treatment_name",
          },
          {
            title: "Currency",
            key: "currency",
            dataIndex: "currency",
          },
          {
            title: "Price",
            key: "price",
            dataIndex: "price",
          },
        ]}
      />
    </>
  );
}
