import { cn } from "@/lib/functions";
import { buttonVariants } from "@/styles/variants";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { forwardRef, type ComponentProps } from "react";
import { PulseLoader } from "react-spinners";
import { type VariantProps } from "tailwind-variants";
import Iconify from "./Iconify";
import { inputIconSize } from "./Input";

const ButtonLoader = () => <PulseLoader color="white" size={6} />;

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
    icon?: IconifyIcon | string;
    classNameDiv?: string;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type, color, disabled, size, className, loading = false, children, classNameDiv, rounded, icon, ...rest }, ref) => {
    return (
      <button
        disabled={type === "submit" ? loading || disabled : disabled}
        type={type ? type : "button"}
        ref={ref}
        {...rest}
        className={cn(buttonVariants({ color: loading || disabled ? "disabled" : color, size, rounded, className }))}
      >
        {loading ? (
          <ButtonLoader />
        ) : (
          <section className={cn(classNameDiv, { "flex justify-center gap-1.5 items-center": icon })}>
            {icon && !loading ? <Iconify icon={icon} width={inputIconSize} /> : null}
            <section>{children}</section>
          </section>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
