import { z } from "zod";
import { userModel } from "../user.model";

export const dynamicPageModel = z.object({
  id: z.string().cuid(),
  title: z.string().max(255),
  content: z.string(),
  author: userModel.pick({
    name: true,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const dynamicPageDto = dynamicPageModel.pick({
  title: true,
  content: true,
});

export type DynamicPage = z.infer<typeof dynamicPageModel>;
export type DynamicPageDto = z.infer<typeof dynamicPageDto>;
