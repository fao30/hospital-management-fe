import { type Lang, type MenuItemKey } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { type Session } from "next-auth";
import { type ReadonlyURLSearchParams } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { type z } from "zod";

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

export const createUrl = (pathname: string, searchParams: URLSearchParams | ReadonlyURLSearchParams) => {
  const paramsString = searchParams.toString();
  const queryString = `${paramsString.length ? "?" : ""}${paramsString}`;
  return `${pathname}${queryString}`;
};

// YYYY-MM-DD to Date
export const getNewDate = (dateString?: string): Date => {
  if (dateString) return new Date(dateString);
  return new Date();
};

// Date to YYYY-MM-DD
export const getInputDate = (date?: Date): string => {
  const dateString = date ?? getNewDate();
  const year = dateString.getFullYear();
  const month = String(dateString.getMonth() + 1).padStart(2, "0");
  const day = String(dateString.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const convertInputDate = (dateString: string): string => {
  const parts = dateString.split("-");
  const year = parts[0];
  const month = parts[1];
  const day = parts[2];
  return `${day}-${month}-${year}`;
};

export const formatDate = ({
  lang,
  date,
  style,
  withTime,
}: {
  withTime?: boolean;
  lang?: Lang;
  date?: Date;
  style: "long" | "short";
}): string => {
  return (date ? getNewDate(date.toString()) : getNewDate()).toLocaleDateString(lang ?? "en-US", {
    year: "numeric",
    month: style === "long" ? "long" : "numeric",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : undefined),
  });
};

export const formatCurrency = ({ amount, currency, locale }: { amount: number; currency: string; locale: Lang }) => {
  const formatter = Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
};

export const textEllipsis = (text: string, length: number): string => {
  if (!text) return "";
  return text.length < length ? `${text}` : `${text.substring(0, length - 3)}...`;
};

export const accumulateValue = <T extends Record<K, number>, K extends keyof T>(array: T[], fieldName: K): T[K] => {
  return array.reduce((accumulator, item) => accumulator + item[fieldName], 0) as unknown as T[K];
};

type PowOf2 = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024;
type SizeUnit = "B" | "KB" | "MB" | "GB";
type FileSize = `${PowOf2}${SizeUnit}`;

const bytesInUnit: Record<SizeUnit, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

const powOf2: Record<PowOf2, number> = {
  1: 1,
  2: 2,
  4: 4,
  8: 8,
  16: 16,
  32: 32,
  64: 64,
  128: 128,
  256: 256,
  512: 512,
  1024: 1024,
};

export const isFileSizeAllowed = (maxFileSize: FileSize, fileSize: number): boolean => {
  const fileSizeRegex = /^(\d+)(B|KB|MB|GB)$/;
  const match = maxFileSize.match(fileSizeRegex);
  const size = parseInt(match![1]!, 10);
  const unit = match![2] as SizeUnit;

  const maxSize = powOf2[size as PowOf2] * bytesInUnit[unit as SizeUnit];
  if (fileSize < maxSize) return true;
  return false;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkValidation = <T>(zodSchema: z.ZodType<T, any, any>, input: unknown) => {
  const validation = zodSchema.safeParse(input);

  if (!validation.success) {
    console.error(validation.error);
    throw new Error(JSON.stringify(validation.error));
  }

  return validation.data;
};

const timestampInfo = `${getNewDate().toLocaleTimeString(undefined, {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
})} 👉`;

export const timestamp = { error: `❌ ${timestampInfo}`, success: `✅ ${timestampInfo}` };

export const getError = ({
  error,
  url,
  session,
  plain,
  status,
}: {
  error: unknown;
  url: string;
  session: Session | null;
  plain?: boolean;
  status: number;
}) => {
  const details = {
    error: `${timestamp.error} ERROR: `,
    url: `${timestamp.error} URL: `,
    status: `${timestamp.error} STATUS: `,
    session: `${timestamp.error} SESSION: `,
  };
  if (plain)
    return `\n${details.error}${typeof error === "string" ? error : JSON.stringify(error)}\n${details.url}${url}\n${
      details.status
    }${status}\n${details.session}${JSON.stringify(session)}`;
  console.error(details.error, error);
  console.error(details.url, url);
  console.error(details.session, session);
};

export const consoleError = (error: string) => console.error(`${timestamp.error} ${error}`);

export const getSelectedMenu = (pathname: string): MenuItemKey[] => {
  const substring = "/dashboard";
  const startIndex = pathname.indexOf(substring);

  if (startIndex !== -1) {
    const extractedString = pathname.substring(startIndex + substring.length);
    const parts = extractedString.split("/").filter((part) => part !== "");
    const result = parts.map((_, index) => `/${parts.slice(0, index + 1).join("/")}`);
    if (result.length > 0) {
      return result as MenuItemKey[];
    } else {
      return ["/"];
    }
  } else {
    return [];
  }
};

export const localizePhoneNumber = (phoneNumber: string): string => `+${phoneNumber}`;
