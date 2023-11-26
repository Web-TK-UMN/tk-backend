import { Router } from "express";
import { verifyJwt } from "@/middlewares/validateJwt.middleware";
import {
  createItem,
  updateItem,
  getContentBySlug,
  deleteItem,
  reorderItems,
} from "@/handlers/item.handler";

import {
  createOrUpdateDynamicPage,
  createOrUpdateLink,
  createOrUpdateProfilePage,
  addProfileToProfilePage,
  deleteProfileFromProfilePage,
  updateProfileFromProfilePage,
} from "@/handlers/content.handler";

const router = Router({ mergeParams: true });

router.put("/order/:slugCategory", verifyJwt, reorderItems);
router.get("/:slugCategory/:slugItem", getContentBySlug);
router.post("/:slugCategory", verifyJwt, createItem);
router.put("/:slugCategory/:slugItem", verifyJwt, updateItem);
router.delete("/:slugCategory/:slugItem", verifyJwt, deleteItem);

// content
router.post(
  "/:slugCategory/:slugItem/dynamic",
  verifyJwt,
  createOrUpdateDynamicPage
);

router.post("/:slugCategory/:slugItem/link", verifyJwt, createOrUpdateLink);

router.post(
  "/:slugCategory/:slugItem/profile",
  verifyJwt,
  createOrUpdateProfilePage
);

router.post(
  "/:slugCategory/:slugItem/profile/entry",
  verifyJwt,
  addProfileToProfilePage
);

router.put(
  "/:slugCategory/:slugItem/profile/entry/:idProfile",
  verifyJwt,
  updateProfileFromProfilePage
);

router.delete(
  "/:slugCategory/:slugItem/profile/entry/:idProfile",
  verifyJwt,
  deleteProfileFromProfilePage
);

export default router;
