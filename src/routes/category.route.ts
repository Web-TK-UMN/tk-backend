import { Router } from "express";
import { verifyJwt } from "@/middlewares/validateJwt.middleware";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  reorderCategories,
  updateCategory,
} from "@/handlers/category.handler";

const router = Router({ mergeParams: true });

router.get("/", getAllCategories);
router.put("/order", verifyJwt, reorderCategories);
router.post("/", verifyJwt, createCategory);
router.get("/:slugCategory", getCategory);
router.put("/:slugCategory", verifyJwt, updateCategory);
router.delete("/:slugCategory", verifyJwt, deleteCategory);

export default router;
