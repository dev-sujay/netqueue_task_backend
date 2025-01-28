import Product, { type IProduct } from "../models/Product"
import Category from "../models/Category"
import csv from "csv-parser"
import fs from "fs"
import { logger } from "../utils/logger"

export class ProductService {
  async importProductsFromCSV(filePath: string): Promise<void> {
    const categoryHierarchy = await this.importCategories(filePath)

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          try {
            const categoryPaths = row.Categories.split(",").map((c: string) => c.trim())
            const categoryIds = await Promise.all(
              categoryPaths.map(async (path: string) => {
                const slug = this.createSlug(path)
                return categoryHierarchy[slug]
              }),
            )

            const product = new Product({
              productId: row.ID,
              type: row.Type,
              sku: row.SKU,
              name: row.Name,
              published: row.Published === "1",
              isFeatured: row["Is featured?"] === "1",
              visibilityInCatalog: row["Visibility in catalog"],
              shortDescription: row["Short description"],
              description: row.Description,
              dateOnSaleTo: row["Date sale price ends"] ? new Date(row["Date sale price ends"]) : null,
              dateOnSaleFrom: row["Date sale price starts"] ? new Date(row["Date sale price starts"]) : null,
              taxStatus: row["Tax status"],
              taxClass: row["Tax class"],
              inStock: row["In stock?"] === "1",
              stock: Number.parseInt(row.Stock) || 0,
              lowStockAmount: row["Low stock amount"] ? Number.parseInt(row["Low stock amount"]) : null,
              backordersAllowed: row["Backorders allowed?"] === "1",
              soldIndividually: row["Sold individually?"] === "1",
              weight: row["Weight (kg)"] ? Number.parseFloat(row["Weight (kg)"]) : null,
              dimensions: {
                length: row["Length (cm)"] ? Number.parseFloat(row["Length (cm)"]) : null,
                width: row["Width (cm)"] ? Number.parseFloat(row["Width (cm)"]) : null,
                height: row["Height (cm)"] ? Number.parseFloat(row["Height (cm)"]) : null,
              },
              allowCustomerReviews: row["Allow customer reviews?"] === "1",
              purchaseNote: row["Purchase note"],
              salePrice: row["Sale price"] ? Number.parseFloat(row["Sale price"]) : null,
              regularPrice: row["Regular price"] ? Number.parseFloat(row["Regular price"]) : null,
              categories: categoryIds,
              tags: row.Tags ? row.Tags.split(",").map((tag: string) => tag.trim()) : [],
              images: row.Images ? row.Images.split(",").map((img: string) => img.trim()) : [],
              attributes: [
                { name: "BRAND", value: row["Attribute 1 value(s)"] },
                { name: "CONDITION", value: row["Attribute 2 value(s)"] },
                { name: "GENDER", value: row["Attribute 3 value(s)"] },
                { name: "MOVEMENT", value: row["Attribute 4 value(s)"] },
                { name: "GOLD COLOUR", value: row["Attribute 5 value(s)"] },
                { name: "MATERIAL", value: row["Attribute 6 value(s)"] },
                { name: "RETAIL", value: row["Attribute 7 value(s)"] },
              ].filter((attr) => attr.value),
            })

            await product.save()
            logger.info(`Imported product: ${product.name}`)
          } catch (error) {
            logger.error(`Error importing product ${row.Name}:`, error)
          }
        })
        .on("end", resolve)
        .on("error", reject)
    })
  }

  private async importCategories(filePath: string): Promise<Record<string, string>> {
    const categories: Record<string, { name: string; slug: string; parent: string | null }> = {}
    const categoryHierarchy: Record<string, string> = {}

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const categoryPath = row.Categories.split(">").map((c: string) => c.trim())
          let currentPath = ""
          categoryPath.forEach((categoryName: string) => {
            currentPath += (currentPath ? " > " : "") + categoryName
            if (!categories[currentPath]) {
              categories[currentPath] = {
                name: categoryName,
                slug: this.createSlug(currentPath),
                parent: null,
              }
            }
          })
        })
        .on("end", resolve)
        .on("error", reject)
    })

    Object.keys(categories).forEach((path) => {
      const parts = path.split(" > ")
      if (parts.length > 1) {
        const parentPath = parts.slice(0, -1).join(" > ")
        categories[path].parent = categories[parentPath].slug
      }
    })

    for (const [path, category] of Object.entries(categories)) {
      const { name, slug, parent } = category
      const existingCategory = await Category.findOne({ slug })
      if (existingCategory) {
        logger.info(`Category ${name} already exists, updating...`)
        existingCategory.name = name
        existingCategory.parent = parent ? (await Category.findOne({ slug: parent }))?._id : null
        await existingCategory.save()
        categoryHierarchy[slug] = existingCategory._id.toString()
      } else {
        logger.info(`Creating new category: ${name}`)
        const newCategory = new Category({
          name,
          slug,
          parent: parent ? (await Category.findOne({ slug: parent }))?._id : null,
        })
        await newCategory.save()
        categoryHierarchy[slug] = newCategory._id.toString()
      }
    }

    return categoryHierarchy
  }

  private createSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  async getProducts(filters: Record<string, any>): Promise<IProduct[]> {
    const query: Record<string, any> = {}

    if (filters.categories) {
      const categoryIds = await Category.find({ slug: { $in: filters.categories } }).distinct("_id")
      query.categories = { $in: categoryIds }
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.regularPrice = {}
      if (filters.minPrice !== undefined) query.regularPrice.$gte = filters.minPrice
      if (filters.maxPrice !== undefined) query.regularPrice.$lte = filters.maxPrice
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
      ]
    }

    if (filters.inStock !== undefined) {
      query.inStock = filters.inStock
    }

    if (filters.tags) {
      query.tags = { $in: filters.tags }
    }

    if (filters.attributes) {
      const attributeQueries = Object.entries(filters.attributes).map(([key, value]) => ({
        attributes: { $elemMatch: { name: key, value: value } },
      }))
      query.$and = (query.$and || []).concat(attributeQueries)
    }

    const sortOptions: Record<string, 1 | -1> = {}
    if (filters.sortBy) {
      sortOptions[filters.sortBy] = filters.sortOrder === "desc" ? -1 : 1
    }

    const page = filters.page || 1
    const limit = filters.limit || 20
    const skip = (page - 1) * limit

    return Product.find(query).sort(sortOptions).skip(skip).limit(limit).populate("categories")
  }
}

export default ProductService