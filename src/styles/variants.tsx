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

export const buttonVariants = tv({
  base: "select-none font-medium outline-none text-center text-white",
  variants: {
    color: {
      none: "bg-transparent",
      primary: "bg-blue",
      disabled: "bg-charcoal",
      danger: "bg-briquette",
    },
    size: {
      small: "h-8",
      medium: "h-10",
      large: "h-12",
    },
    rounded: {
      none: "rounded-none",
      md: "rounded-md",
      lg: "rounded-lg",
      xl: "rounded-xl",
      "2xl": "rounded-2xl",
      "3xl": "rounded-3xl",
      full: "rounded-full",
    },
  },
  defaultVariants: {
    rounded: "none",
    size: "medium",
    color: "primary",
  },
});
