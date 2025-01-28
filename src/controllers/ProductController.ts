import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { logger } from '../utils/logger';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  async importProducts(req: Request, res: Response): Promise<void> {
    try {
      const filePath = req.file?.path;
      if (!filePath) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      await this.productService.importProductsFromCSV(filePath);
      res.status(200).json({ message: 'Products imported successfully' });
    } catch (error) {
      logger.error('Error importing products:', error);
      res.status(500).json({ error: 'Error importing products' });
    }
  }

  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const products = await this.productService.getProducts(filters);
      res.status(200).json(products);
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({ error: 'Error fetching products' });
    }
  }
}
