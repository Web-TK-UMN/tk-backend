import { NextFunction, Request, Response } from "express";
import { unauthorized } from "@/utils/responses";
import { verify } from "jsonwebtoken";
import ENV from "@/utils/env";
import db from "@/services/db";

export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return unauthorized(res, "No token provided");

    const verified = verify(token!, ENV.APP_JWT_SECRET) as {
      id: string;
    };

    if (!verified) {
      return unauthorized(res, "Invalid token");
    }

    const user = await db.user.findUnique({
      where: { id: verified.id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) return unauthorized(res, "Invalid token");
    req.user = user;

    next();
  } catch (err) {
    return unauthorized(res, "Invalid token");
  }
};
