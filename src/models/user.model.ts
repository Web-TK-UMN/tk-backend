import { z } from "zod";

export const userModel = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  name: z.string().max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// with recaptcha token
export const userLoginDto = userModel
  .pick({
    email: true,
    password: true,
  })
  .extend({
    reCAPTCHAToken: z.string(),
  });

export type User = z.infer<typeof userModel>;
export type UserLoginDto = z.infer<typeof userLoginDto>;

export type ReCAPTCHAResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  "error-codes": string[];
};
