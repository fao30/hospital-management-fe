"use client";

import { type AppRouter } from "@/api/root";
import { getUrl, transformer } from "@/trpc/shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { unstable_httpBatchStreamLink as httpBatchStreamLink, loggerLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { useState } from "react";

export const api = createTRPCReact<AppRouter>();

export function TRPCReactProvider(props: { children: React.ReactNode; cookies: string }) {
  const [queryClient] = useState(() => new QueryClient());

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) => process.env.NODE_ENV === "development" || (op.direction === "down" && op.result instanceof Error),
        }),
        httpBatchStreamLink({
          url: getUrl(),
          headers: () => ({ cookie: props.cookies, "x-trpc-source": "react" }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
