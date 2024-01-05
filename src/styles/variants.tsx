import { tv } from "tailwind-variants";

export const inputVariants = tv({
  base: "w-full animate outline-none focus:outline-none active:outline-none border-b-1.5 border-black bg-inherit",
  variants: {
    color: {
      primary: "focus:border-blue-500",
      disabled: "bg-gray-300",
    },
    size: {
      m: "h-10",
    },
    rounded: {
      none: "!rounded-none",
      md: "rounded-md",
    },
  },
  defaultVariants: {
    size: "m",
    color: "primary",
    rounded: "none",
  },
});
