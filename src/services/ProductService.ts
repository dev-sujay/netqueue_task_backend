import Product, { type IProduct } from "../models/Product"
import type { FilterQuery } from "mongoose"
import Logger from "../utils/logger"

class ProductService {
  async getProducts(queryStr: any): Promise<IProduct[]> {
    Logger.info("Getting products with query", { query: queryStr })

    const queryObj = { ...queryStr }
    const excludedFields = ["page", "sort", "limit", "fields", "search", "category"]
    excludedFields.forEach((el) => delete queryObj[el])

    // Advanced filtering
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

    const query: FilterQuery<IProduct> = JSON.parse(queryString)

    // Handle category filtering
    if (queryStr.category) {
      query.Categories = this.buildCategoryQuery(queryStr.category)
    }

    // Handle brand filtering
    if (queryStr.brand) {
      query.Brand = { $regex: queryStr.brand, $options: "i" }
    }

    // Handle condition filtering
    if (queryStr.condition) {
      query.Condition = { $regex: queryStr.condition, $options: "i" }
    }

    // Handle gender filtering
    if (queryStr.gender) {
      query.Gender = { $regex: queryStr.gender, $options: "i" }
    }

    // Handle material filtering
    if (queryStr.material) {
      query.Material = { $regex: queryStr.material, $options: "i" }
    }

    // Handle price range filtering
    if (queryStr.minPrice || queryStr.maxPrice) {
      query.RegularPrice = {}
      if (queryStr.minPrice) query.RegularPrice.$gte = Number(queryStr.minPrice)
      if (queryStr.maxPrice) query.RegularPrice.$lte = Number(queryStr.maxPrice)
    }

    // Handle in-stock filtering
    if (queryStr.inStock) {
      query.InStock = queryStr.inStock === "true" ? { $gt: 0 } : 0
    }

    // Search functionality
    if (queryStr.search) {
      query.$text = { $search: queryStr.search }
    }

    // Filtering
    let productsQuery = Product.find(query)

    // Sorting
    if (queryStr.sort) {
      const sortBy = queryStr.sort.split(",").join(" ")
      productsQuery = productsQuery.sort(sortBy)
    } else {
      productsQuery = productsQuery.sort("-createdAt")
    }

    // Field limiting
    if (queryStr.fields) {
      const fields = queryStr.fields.split(",").join(" ")
      productsQuery = productsQuery.select(fields)
    } else {
      productsQuery = productsQuery.select("-__v")
    }

    // Pagination
    const page = Number.parseInt(queryStr.page, 10) || 1
    const limit = Number.parseInt(queryStr.limit, 10) || 100
    const skip = (page - 1) * limit

    productsQuery = productsQuery.skip(skip).limit(limit)

    const products = await productsQuery

    Logger.info("Products retrieved successfully", { count: products.length })

    return products
  }

  private buildCategoryQuery(category: string): FilterQuery<IProduct>["Categories"] {
    const escapedCategory = category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    return {
      $regex: `(^|>\\s*)${escapedCategory}(\\s*>|$)`,
      $options: "i",
    }
  }

  async bulkCreateProducts(productsData: Partial<IProduct>[]): Promise<IProduct[]> {
    Logger.info("Bulk creating products", { count: productsData.length })
    const createdProducts = await Product.create(productsData)
    Logger.info("Products created successfully", { count: createdProducts.length })
    return createdProducts
  }
}

export default new ProductService()

