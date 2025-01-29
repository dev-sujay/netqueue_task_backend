import express from "express"
import multer from "multer"
import { getProductsController, importProductsController } from "../controllers/ProductController"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post("/import", upload.single("file"), importProductsController)
router.get("/", getProductsController)

export default router

