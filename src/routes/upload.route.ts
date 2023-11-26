import { upload, whitelistFile } from "@/middlewares/file.middleware";
import { Router } from "express";
// import { fileTypeFromFile } from "file-type";
import { validationError } from "@/utils/responses";
import ENV from "@/utils/env";
import { verifyJwt } from "@/middlewares/validateJwt.middleware";

const router = Router();

router.post("/", verifyJwt, async (req, res) => {
  upload.single("upload")(req, res, (err) => {
    if (err) {
      //   return validationError(res, err.message);
      return res.status(422).json({
        uploaded: false,
        error: {
          message: err.message,
        },
      });
    }

    if (!req.file) {
      // special case for ckEditor
      return res.status(422).json({
        uploaded: false,
        error: {
          message: "File is not supported",
        },
      });
    }

    // special case for ckEditor
    return res.json({
      uploaded: true,
      url: `${ENV.APP_API_URL}/public/${req.file.filename}`,
    });
  });
});

export default router;
