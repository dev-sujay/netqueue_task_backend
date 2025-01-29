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
    const {
      category,
      minPrice,
      maxPrice,
      pageNum,
      pageSize,
      gender,
      condition,
      watchBrand,
      jewelryBrand,
      material,
      sortBy,
      sortOrder,
      isPublished
    } = req.query;

    const page = Number.parseInt(pageNum as string) || 1;
    const limit = Number.parseInt(pageSize as string) || 10;

    const pipeline: any[] = [];

    // Match stage for basic filters
    const matchStage: any = {};

    if (isPublished) {
      matchStage.published = isPublished === "true";
    }

    if (category) {
      matchStage.categories = new RegExp(category as string, "i");
    }

    if (minPrice || maxPrice) {
      matchStage.regularPrice = {};
      if (minPrice)
        matchStage.regularPrice.$gte = Number.parseFloat(minPrice as string);
      if (maxPrice)
        matchStage.regularPrice.$lte = Number.parseFloat(maxPrice as string);
    }

    // Add first match stage if there are any basic filters
    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    // Add attribute filters
    const attributeFilters = [];
    if (gender) {
      attributeFilters.push({
        $match: {
          attributes: {
            $elemMatch: {
              name: "GENDER",
              value: new RegExp(gender as string, "i"),
            },
          },
        },
      });
    }

    if (condition) {
      attributeFilters.push({
        $match: {
          attributes: {
            $elemMatch: {
              name: "CONDITION",
              value: new RegExp(condition as string, "i"),
            },
          },
        },
      });
    }

    if (watchBrand) {
      attributeFilters.push({
        $match: {
          attributes: {
            $elemMatch: {
              name: "BRAND",
              value: new RegExp(watchBrand as string, "i"),
            },
          },
        },
      });
    }

    if (jewelryBrand) {
      attributeFilters.push({
        $match: {
          attributes: {
            $elemMatch: {
              name: "BRAND JEWELLERY",
              value: new RegExp(jewelryBrand as string, "i"),
            },
          },
        },
      });
    }

    if (material) {
      attributeFilters.push({
        $match: {
          attributes: {
            $elemMatch: {
              name: "MATERIAL",
              value: new RegExp(material as string, "i"),
            },
          },
        },
      });
    }

    pipeline.push(...attributeFilters);

    // Add sort stage
    if (sortBy) {
      pipeline.push({
        $sort: {
          [sortBy as string]: sortOrder === "desc" ? -1 : 1,
        },
      });
    }

    // Add pagination
    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    // Execute the aggregation
    const products = await Product.aggregate(pipeline);

    // Get total count with the same filters but without pagination
    const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit stages
    countPipeline.push({ $count: "total" });
    const totalResult = await Product.aggregate(countPipeline);
    const total = totalResult[0]?.total || 0;

    res.json({
      total,
      products,
    });
  } catch (error) {
    logger.error("Error processing request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
