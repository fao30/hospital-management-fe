import Iconify from "@/components/Iconify";
import { ICONS } from "@/lib/constants";
import { COLORS } from "@/styles/theme";
import { type Dictionary } from "@/types";
import { type IconifyIcon } from "@iconify/react/dist/iconify.js";
import { notification } from "antd";

type ToastType = "success" | "error" | "warning" | "info";

const toastIcons: Record<ToastType, { icon: IconifyIcon | string; color: string }> = {
  success: {
    icon: ICONS.success,
    color: COLORS.emerald,
  },
  error: {
    icon: ICONS.error,
    color: COLORS.briquette,
  },
  info: {
    icon: ICONS.info,
    color: COLORS.blue,
  },
  warning: {
    icon: ICONS.warning,
    color: COLORS.sunflower,
  },
};

export const toast = ({ type, description, t }: { type: ToastType; description: string; t: Dictionary | null }) => {
  return notification[type]({
    description,
    message: t?.toast[type],
    duration: 3,
    style: { backgroundColor: "white" },
    icon: <Iconify icon={toastIcons[type].icon} width={25} color={toastIcons[type].color} />,
  });
};

export const toastError = ({ t, description }: { t: Dictionary | null; description: string }) =>
  toast({ t, description, type: "error" });
export const toastSuccess = ({ t, description }: { t: Dictionary | null; description: string }) =>
  toast({ t, description, type: "success" });
export const toastWarning = ({ t, description }: { t: Dictionary | null; description: string }) =>
  toast({ t, description, type: "warning" });
export const toastInfo = ({ t, description }: { t: Dictionary | null; description: string }) =>
  toast({ t, description, type: "info" });
