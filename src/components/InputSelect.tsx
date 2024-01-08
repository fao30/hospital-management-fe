import { cn } from "@/lib/functions";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { ConfigProvider } from "antd";
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
      <section className="flex flex-col gap-0.5">
        {props.label ? <label htmlFor={id}>{props.label}</label> : null}
        <section className="relative">
          <Select
            ref={ref}
            {...props}
            id={id}
            optionFilterProp="children"
            filterOption={(input, option) => ((option?.label as string) ?? "").toLowerCase().includes(input.toLowerCase())}
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