import type { Request, Response } from "express";
import { importProducts } from "../services/importService";
import Product from "../models/Product";
import { logger } from "../utils/logger";

export async function importProductsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const result = await importProducts(req.file.buffer);
    res.json(result);
  } catch (error) {
    logger.error("Error in import controller:", error);
    res.status(500).json({ error: "Internal server error during import" });
  }
}

export async function getProductsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const { category, minPrice, maxPrice, pageNum, pageSize } = req.query;

    const page = Number.parseInt(pageNum as string) || 1;
    const limit = Number.parseInt(pageSize as string) || 10;

    const query: any = {};

    if (category) {
      query.categories = new RegExp(category as string, "i");
    }

    if (minPrice || maxPrice) {
      query.regularPrice = {};
      if (minPrice)
        query.regularPrice.$gte = Number.parseFloat(minPrice as string);
      if (maxPrice)
        query.regularPrice.$lte = Number.parseFloat(maxPrice as string);
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      total,
      products
    });
  } catch (error) {
    logger.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
