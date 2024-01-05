"use client";

import { ICONS } from "@/lib/constants";
import { cn } from "@/lib/functions";
import { inputVariants } from "@/styles/variants";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useId, useState, type ComponentProps } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";

type InputProps = ComponentProps<"input"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    label?: string;
    classNameDiv?: string;
    icon?: IconifyIcon | string;
    withPasswordIcon?: boolean;
  };

export const inputIconSize = 22;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, type, className, size, color, icon, disabled, classNameDiv, withPasswordIcon, ...rest }, ref) => {
    const id = useId();

    const [showPassword, setShowPassword] = useState(false);

    if (type !== "password") {
      return (
        <section className={cn(classNameDiv, { "gap-0.5 flex flex-col": label })}>
          {label ? <label htmlFor={id}>{label}</label> : null}
          <section className="relative">
            <input
              disabled={disabled}
              inputMode={type === "number" ? "numeric" : undefined}
              type={type ? type : "text"}
              className={cn(
                "pr-3",
                inputVariants({ className, size, color: disabled ? "disabled" : color }),
                { "border-red-500 focus:border-red-500": error },
                { "pl-7": icon },
              )}
              ref={ref}
              id={id}
              {...rest}
            />
            {icon ? <Iconify width={inputIconSize} icon={icon} className="absolute centered-left text-dark" /> : null}
          </section>
          {error ? <small className={cn("text-red-500 text-xs mt-0.5")}>{error}</small> : null}
        </section>
      );
    }

    return (
      <section className={cn(classNameDiv, { "gap-0.5 flex flex-col": label })}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <section className="relative">
          <input
            ref={ref}
            {...rest}
            id={id}
            placeholder="*********"
            type={showPassword ? "text" : "password"}
            className={cn(inputVariants({ size, color, className }), {
              "border-red-500 focus:border-red-500": error,
              "pl-7 pr-9": withPasswordIcon,
            })}
          />

          {withPasswordIcon ? (
            <Iconify width={inputIconSize} icon={ICONS.password} className="absolute centered-left text-dark" />
          ) : null}

          <section
            className="absolute centered-right -translate-x-3 text-dark cursor-pointer text-xl"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </section>
        </section>
        {error ? <small className={cn("text-red-500 text-xs mt-0.5")}>{error}</small> : null}
      </section>
    );
  },
);

export default Input;
