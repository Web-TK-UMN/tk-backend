import { z } from "zod";
import { dynamicPageModel } from "@/models/items/dynamic.page.model";
import { profilePageModel } from "@/models/items/profile.page.model";
import { linkModel } from "@/models/items/link.model";

export const itemModel = z.object({
  id: z.string().cuid(),
  title: z.string().max(255),
  slug: z.string().max(255),
  order: z.number(),
  type: z.enum(["PROFILE", "DYNAMIC", "LINK"]),
  dynamic: dynamicPageModel.optional(),
  profile: profilePageModel.optional(),
  link: linkModel.optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createItemDto = itemModel.pick({
  title: true,
  slug: true,
  type: true,
});

export const updateItemDto = itemModel.partial().pick({
  title: true,
  slug: true,
  // order: true,
  // type: true,
  // dynamic: true,
  // profile: true,
  // link: true,
});

export const reorderDto = z.object({
  order: z.array(z.string().max(255)).nonempty(),
});

export const itemChildren = itemModel.partial().pick({
  dynamic: true,
  profile: true,
  link: true,
});

export type Item = z.infer<typeof itemModel>;
export type CreateItemDto = z.infer<typeof createItemDto>;
export type UpdateItemDto = z.infer<typeof updateItemDto>;
export type ReorderDto = z.infer<typeof reorderDto>;
export type ItemChildren = z.infer<typeof itemChildren>;
