import multer from "multer";
import { createId } from "@paralleldrive/cuid2";
import { NextFunction, Request, Response } from "express";
import { validationError } from "@/utils/responses";

export const whitelistFile = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

export const upload = multer({
  // limit to 4mb
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: "public/",
    filename: (req, file, cb) => {
      // cuid + extension
      const filename = `${createId()}.${file.mimetype.split("/")[1]}`;
      cb(null, filename);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!whitelistFile.includes(file.mimetype)) {
      return cb(new Error("file is not allowed"));
    }

    cb(null, true);
  },
});
