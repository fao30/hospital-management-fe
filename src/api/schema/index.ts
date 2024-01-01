import { z } from "zod";

export class schema {
  static pagination = { page: z.number().min(1), limit: z.number().optional() };

  static user = {
    list: z.object({ params: z.object({ ...schema.pagination }) }),
    create: z.object({ body: z.object({ name: z.string() }) }),
  };
}
