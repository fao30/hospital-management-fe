import { z } from "zod";

export class schema {
  static user = {
    list: { params: z.object({ page: z.number() }) },
    create: { body: z.object({ name: z.string().min(4) }) },
  };
}
