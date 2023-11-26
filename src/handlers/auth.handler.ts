import { Request, Response } from "express";
import db from "@/services/db";
import { type UserLoginDto, userLoginDto } from "@/models/user.model";
import {
  internalServerError,
  notFound,
  parseZodError,
  success,
  unauthorized,
  validationError,
} from "@/utils/responses";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

export const loginHandler = async (
  req: Request<{}, {}, UserLoginDto>,
  res: Response
) => {
  try {
    const validate = await userLoginDto.safeParseAsync(req.body);
    if (!validate.success) {
      return validationError(res, parseZodError(validate.error));
    }

    const { email, password } = validate.data;
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return notFound(res, "User not found");
    }

    if (!(await compare(password, user.password))) {
      return unauthorized(res, "Wrong password");
    }

    const token = sign({ id: user.id }, process.env.APP_JWT_SECRET!, {
      expiresIn: "1d",
    });

    return success(res, "Login berhasil!", {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    return internalServerError(res);
  }
};

export const profileHandler = async (req: Request, res: Response) => {
  return success(res, "Berhasil mendapatkan profile user!", { user: req.user });
};
