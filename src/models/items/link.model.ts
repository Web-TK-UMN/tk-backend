import { z } from "zod";
import { userModel } from "../user.model";

export const linkModel = z.object({
  id: z.string().cuid(),
  name: z.string().max(255),
  title: z.string().max(255),
  url: z.string().url(),
  author: userModel.pick({
    name: true,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const linkDto = linkModel.pick({
  title: true,
  url: true,
});

export type Link = z.infer<typeof linkModel>;
export type LinkDto = z.infer<typeof linkDto>;
