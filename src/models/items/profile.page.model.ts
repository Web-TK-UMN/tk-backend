import { z } from "zod";
import { userModel } from "@/models/user.model";

export const profileModel = z.object({
  id: z.string().cuid(),
  name: z.string().max(255),
  email: z.string().email(),
  picUrl: z.string().url(),
  position: z.string().max(255),
  expertise: z.string().max(255),
  staffHandbookLink: z.string().url(),
  profileUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const profileDto = profileModel.pick({
  name: true,
  email: true,
  picUrl: true,
  position: true,
  expertise: true,
  staffHandbookLink: true,
  profileUrl: true,
});

export type Profile = z.infer<typeof profileModel>;
export type ProfileDto = z.infer<typeof profileDto>;

export const profilePageModel = z.object({
  id: z.string().cuid(),
  description: z.string(),
  profile: z.array(profileModel),
  author: userModel.pick({
    name: true,
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const profilePageDto = profilePageModel.pick({
  description: true,
});

export type ProfilePage = z.infer<typeof profilePageModel>;
export type ProfilePageDto = z.infer<typeof profilePageDto>;
