import express from "express"
import ProductController from "../controllers/ProductController"
import { validateFilters } from "../middleware/validation"
import multer from "multer"

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get("/", validateFilters, ProductController.getProducts)
router.post("/upload", upload.single("csv"), ProductController.uploadCsv)

export default router

