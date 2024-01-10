"use client";

import { cn } from "@/lib/functions";
import { inputVariants } from "@/styles/variants";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useId, type ComponentProps } from "react";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";

type InputProps = ComponentProps<"textarea"> &
  VariantProps<typeof inputVariants> & {
    error?: string;
    label?: string;
    classNameDiv?: string;
    icon?: IconifyIcon | string;
    withPasswordIcon?: boolean;
  };

export const inputIconSize = 22;

const InputTextarea = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ label, error, className, size, color, icon, disabled, classNameDiv, ...rest }, ref) => {
    const id = useId();

    return (
      <section className={cn("flex flex-col", classNameDiv, { "gap-0.5": label })}>
        {label ? <label htmlFor={id}>{label}</label> : null}
        <section className="relative">
          <textarea
            disabled={disabled}
            className={cn(
              inputVariants({ className, size, color: disabled ? "disabled" : color }),
              { "border-briquette focus:border-briquette": error },
              { "pl-7": icon },
            )}
            ref={ref}
            id={id}
            {...rest}
          />
          {icon ? <Iconify width={inputIconSize} icon={icon} className="absolute centered-left text-dark" /> : null}
        </section>
        {error ? <small className={cn("text-briquette text-xs mt-0.5")}>{error}</small> : null}
      </section>
    );
  },
);

export default InputTextarea;
