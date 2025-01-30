import express from "express"
import multer from "multer"
import { createProductController, deleteProductController, getProductsController, importProductsController, updateProductController } from "../controllers/ProductController"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/import", upload.single("file"), importProductsController)
router.post("/", createProductController)
router.get("/", getProductsController)
router.get("/:id", getProductsController)
router.patch("/:id", updateProductController)
router.delete("/:id", deleteProductController)

export default router

