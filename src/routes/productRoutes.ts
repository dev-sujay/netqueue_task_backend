import express from 'express';
import multer from 'multer';
import { ProductController } from '../controllers/ProductController';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const productController = new ProductController();

router.post('/import', upload.single('file'), (req, res) => productController.importProducts(req, res));
router.get('/', (req, res) => productController.getProducts(req, res));

export default router;
