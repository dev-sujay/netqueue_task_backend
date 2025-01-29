import csv from "csv-parser"
import { Readable } from "stream"
import Product, { IProduct } from "../models/Product"

interface CSVProduct {
  [key: string]: string
}

function transformProduct(csvProduct: CSVProduct): Partial<IProduct> {
  const attributes = []
  for (let i = 1; i <= 9; i++) {
    if (csvProduct[`Attribute ${i} name`]) {
      attributes.push({
        name: csvProduct[`Attribute ${i} name`],
        value: csvProduct[`Attribute ${i} value(s)`],
        visible: csvProduct[`Attribute ${i} visible`] === "1",
        global: csvProduct[`Attribute ${i} global`] === "1",
      })
    }
  }

  return {
    productId: Number.parseInt(csvProduct.ID),
    type: csvProduct.Type,
    sku: csvProduct.SKU,
    name: csvProduct.Name,
    published: csvProduct.Published === "1",
    isFeatured: csvProduct["Is featured?"] === "1",
    visibilityInCatalog: csvProduct["Visibility in catalog"] as IProduct["visibilityInCatalog"],
    shortDescription: csvProduct["Short description"],
    description: csvProduct.Description,
    dateOnSaleTo: csvProduct["Date sale price ends"] ? new Date(csvProduct["Date sale price ends"]) : null,
    dateOnSaleFrom: csvProduct["Date sale price starts"] ? new Date(csvProduct["Date sale price starts"]) : null,
    taxStatus: csvProduct["Tax status"] as IProduct["taxStatus"],
    taxClass: csvProduct["Tax class"],
    inStock: csvProduct["In stock?"] === "1",
    stock: Number.parseInt(csvProduct.Stock) || 0,
    lowStockAmount: csvProduct["Low stock amount"] ? Number.parseInt(csvProduct["Low stock amount"]) : null,
    backordersAllowed: csvProduct["Backorders allowed?"] === "1",
    soldIndividually: csvProduct["Sold individually?"] === "1",
    weight: csvProduct["Weight (kg)"] ? Number.parseFloat(csvProduct["Weight (kg)"]) : null,
    dimensions: {
      length: csvProduct["Length (cm)"] ? Number.parseFloat(csvProduct["Length (cm)"]) : null,
      width: csvProduct["Width (cm)"] ? Number.parseFloat(csvProduct["Width (cm)"]) : null,
      height: csvProduct["Height (cm)"] ? Number.parseFloat(csvProduct["Height (cm)"]) : null,
    },
    allowCustomerReviews: csvProduct["Allow customer reviews?"] === "1",
    purchaseNote: csvProduct["Purchase note"],
    salePrice: csvProduct["Sale price"] ? Number.parseFloat(csvProduct["Sale price"]) : null,
    regularPrice: csvProduct["Regular price"] ? Number.parseFloat(csvProduct["Regular price"]) : 0,
    categories: csvProduct.Categories ? csvProduct.Categories.split(",").map((category) => category.trim()) : [],
    tags: csvProduct.Tags ? csvProduct.Tags.split(",").map((tag) => tag.trim()) : [],
    images: csvProduct.Images ? csvProduct.Images.split(",").map((image) => image.trim()) : [],
    attributes: attributes,
  }
}

export async function importProducts(fileBuffer: Buffer): Promise<{ message: string; count: number }> {
  return new Promise((resolve, reject) => {
    const results: CSVProduct[] = []
    Readable.from(fileBuffer)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
      }))
      .on("data", (data: CSVProduct) => results.push(data))
      .on("end", async () => {
        try {
          const transformedProducts = results.map(transformProduct)
          await Product.deleteMany({}) // Clear existing products
          const importedProducts = await Product.insertMany(transformedProducts)
          resolve({ message: "Products imported successfully", count: importedProducts.length })
        } catch (error) {
          reject(error)
        }
      })
      .on("error", (error: Error) => reject(error))
  })
}

