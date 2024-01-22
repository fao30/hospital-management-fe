import { cn } from "@/lib/functions";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { ConfigProvider, Empty, Spin } from "antd";
import Select, { type BaseOptionType, type DefaultOptionType, type SelectProps } from "antd/es/select";
import { type BaseSelectRef } from "rc-select";
import React, { useId } from "react";
import Iconify from "./Iconify";
import { inputIconSize } from "./Input";
import "@/styles/ant-select.css";

type ValueType = unknown;
type OptionType = BaseOptionType | DefaultOptionType;

type InputSelectProps = SelectProps<ValueType, OptionType> & {
  children?: React.ReactNode;
  icon?: IconifyIcon | string;
  label?: string;
  error?: string;
  multiple?: boolean;
  showSearch?: boolean;
  className?: string;
  classNameDiv?: string;
};

const InputSelect = React.forwardRef<BaseSelectRef, InputSelectProps>((props, ref) => {
  const id = useId();

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            selectorBg: "",
            padding: 0,
          },
        },
      }}
    >
      <section className={cn("flex flex-col gap-0.5", props.classNameDiv)}>
        {props.label ? <label htmlFor={id}>{props.label}</label> : null}
        <section className="relative">
          <Select
            notFoundContent={
              props.loading ? (
                <section className="flex justify-center items-center py-4">
                  <Spin size="small" />
                </section>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )
            }
            ref={ref}
            {...props}
            id={id}
            optionFilterProp="children"
            filterOption={(input, option) =>
              Object.values(option as object)
                .join(" ")
                .toLowerCase()
                .includes(input.toLowerCase())
            }
            style={{ width: "100%", height: "100%", padding: 0 }}
            showSearch={props.showSearch}
          />
          {props.icon ? (
            <Iconify width={inputIconSize} icon={props.icon} className="absolute centered-left translate-x-3 text-dark" />
          ) : null}
        </section>
        {props.error ? <small className={cn("text-briquette text-xs mt-0.5 text-left")}>{props.error}</small> : null}
      </section>
    </ConfigProvider>
  );
});

export default InputSelect;
