import { z } from "zod";

export const categoryModel = z.object({
  id: z.string().cuid(),
  slug: z.string().max(255),
  name: z.string().max(255),
  order: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const categoryCreateDto = categoryModel.pick({
  name: true,
  slug: true,
});

export const reorderDto = z.object({
  order: z.array(z.string().max(255)).nonempty(),
});

export type Category = z.infer<typeof categoryModel>;
export type CategoryCreateDto = z.infer<typeof categoryCreateDto>;
export type ReorderDto = z.infer<typeof reorderDto>;
