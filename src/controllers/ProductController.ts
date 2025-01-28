import type { Request, Response, NextFunction } from "express"
import ProductService from "../services/ProductService"
import CsvService from "../services/CsvService"
import Logger from "../utils/logger"

class ProductController {
  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await ProductService.getProducts(req.query)
      res.json(products)
    } catch (error) {
      Logger.error("Error in getProducts", { error })
      next(error)
    }
  }

  async uploadCsv(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new Error("No file uploaded")
      }

      const products = await CsvService.parseCsvFile(req.file)

      if (products.length === 0) {
        throw new Error("No valid products found in the CSV file")
      }

      const savedProducts = await ProductService.bulkCreateProducts(products)

      res.status(201).json({
        message: "CSV file processed successfully",
        productsCreated: savedProducts.length,
        totalRowsProcessed: products.length,
      })
    } catch (error) {
      Logger.error("Error in uploadCsv", { error })
      next(error)
    }
  }
}

export default new ProductController()

