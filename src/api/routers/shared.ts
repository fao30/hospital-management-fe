import { getServerAuthSession } from "@/api/auth";
import { env } from "@/env";
import { getError } from "@/lib/functions";
import { THROW_TRPC_ERROR, TRPC_ERROR_CODES } from "@/trpc/shared";

type Params = Record<string, string | number | boolean>;

const getUrl = (endpoint: string, params?: Params): string => {
  const newUrl = new URL(`${env.NEXT_PUBLIC_API}${endpoint}`);
  if (params) {
    for (const key of Object.keys(params)) {
      const value = params[key];
      if (value) newUrl.searchParams.set(key, value.toString());
    }
  }
  return newUrl.toString();
};

export const getData = async ({ endpoint, params, cacheType }: { endpoint: string; params?: Params; cacheType?: RequestCache }) => {
  const session = await getServerAuthSession();
  let headers: HeadersInit | undefined = undefined;
  if (session) headers = { Authorization: `Bearer ${session.user.token}` };
  const url = getUrl(endpoint, params);
  const res = await fetch(url, { cache: cacheType ?? "no-store", headers });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};

export const postData = async ({ endpoint, body }: { endpoint: string; body: unknown }) => {
  const session = await getServerAuthSession();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session) headers.Authorization = `Bearer ${session.user.token}`;
  const url = getUrl(endpoint);
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};

export const postFormData = async ({ endpoint, formData }: { endpoint: string; formData: FormData }) => {
  const session = await getServerAuthSession();
  const headers: HeadersInit = { "Content-Type": "multipart/form-data" };
  if (session) headers.Authorization = `Bearer ${session.user.token}`;
  const url = getUrl(endpoint);
  const res = await fetch(url, { method: "POST", headers, body: formData });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};

export const putData = async ({ endpoint, body }: { endpoint: string; body: unknown }) => {
  const session = await getServerAuthSession();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session) headers.Authorization = `Bearer ${session.user.token}`;
  const url = getUrl(endpoint);
  const res = await fetch(url, { method: "PUT", headers, body: JSON.stringify(body) });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};

export const patchData = async ({ endpoint, body }: { endpoint: string; body: unknown }) => {
  const session = await getServerAuthSession();
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (session) headers.Authorization = `Bearer ${session.user.token}`;
  const url = getUrl(endpoint);
  const res = await fetch(url, { method: "PATCH", headers, body: JSON.stringify(body) });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};

export const deleteData = async ({ endpoint }: { endpoint: string }) => {
  const session = await getServerAuthSession();
  let headers: HeadersInit | undefined = undefined;
  if (session) headers = { Authorization: `Bearer ${session.user.token}` };
  const url = getUrl(endpoint);
  const res = await fetch(url, { method: "DELETE", headers });

  if (!res.ok)
    return THROW_TRPC_ERROR(
      TRPC_ERROR_CODES[res.status] ?? "INTERNAL_SERVER_ERROR",
      getError({ plain: true, error: await res.json(), url, session, status: res.status }),
    );

  return res.json() as unknown;
};
