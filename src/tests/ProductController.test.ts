import request from "supertest"
import mongoose from "mongoose"
import app from "../server"
import Product from "../models/Product"

describe("ProductController", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test-product-filter-api")
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  beforeEach(async () => {
    await Product.deleteMany({})
  })

  it("should get all products", async () => {
    await Product.create({
      ID: 1,
      Type: "simple",
      SKU: "TEST001",
      Name: "Test Product",
      Published: 1,
      IsFeatured: 0,
      VisibilityInCatalog: "visible",
      ShortDescription: "Test description",
      InStock: 1,
      Stock: 10,
      RegularPrice: 100,
      Categories: ["Test"],
      Brand: "Test Brand",
    })

    const res = await request(app).get("/api/products")
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    expect(res.body.length).toBe(1)
  })

  it("should filter products", async () => {
    await Product.create({
      ID: 1,
      Type: "simple",
      SKU: "TEST001",
      Name: "Test Product 1",
      Published: 1,
      IsFeatured: 0,
      VisibilityInCatalog: "visible",
      ShortDescription: "Test description",
      InStock: 1,
      Stock: 10,
      RegularPrice: 100,
      SalePrice: 90,
      Categories: ["Test"],
      Brand: "Test Brand",
    })

    await Product.create({
      ID: 2,
      Type: "simple",
      SKU: "TEST002",
      Name: "Test Product 2",
      Published: 1,
      IsFeatured: 0,
      VisibilityInCatalog: "visible",
      ShortDescription: "Another test description",
      InStock: 1,
      Stock: 5,
      RegularPrice: 200,
      SalePrice: 180,
      Categories: ["Another Test"],
      Brand: "Another Brand",
    })

    const res = await request(app).get("/api/products/filter?minPrice=150&maxPrice=250")
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    expect(res.body.length).toBe(1)
    expect(res.body[0].Name).toBe("Test Product 2")
  })

  it("should search products", async () => {
    await Product.create({
      ID: 1,
      Type: "simple",
      SKU: "TEST001",
      Name: "Test Product 1",
      Published: 1,
      IsFeatured: 0,
      VisibilityInCatalog: "visible",
      ShortDescription: "Test description",
      InStock: 1,
      Stock: 10,
      RegularPrice: 100,
      SalePrice: 90,
      Categories: ["Test"],
      Brand: "Test Brand",
    })

    await Product.create({
      ID: 2,
      Type: "simple",
      SKU: "TEST002",
      Name: "Another Product",
      Published: 1,
      IsFeatured: 0,
      VisibilityInCatalog: "visible",
      ShortDescription: "Another test description",
      InStock: 1,
      Stock: 5,
      RegularPrice: 200,
      SalePrice: 180,
      Categories: ["Another Test"],
      Brand: "Another Brand",
    })

    const res = await request(app).get("/api/products/filter?search=Another")
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    expect(res.body.length).toBe(1)
    expect(res.body[0].Name).toBe("Another Product")
  })

  it("should upload CSV file", async () => {
    const csvBuffer =
      Buffer.from(`ID,Type,SKU,Name,Published,Is featured?,Visibility in catalog,Short description,Description,Tax status,In stock?,Stock,Sale price,Regular price,Categories,Images,Brand,Condition,Gender,Movement,Gold Colour,Material
1,simple,TEST001,Test Product,1,0,visible,Test description,Full description,taxable,1,10,90,100,Test,http://example.com/image.jpg,Test Brand,New,Unisex,Automatic,Yellow,Gold`)

    const res = await request(app).post("/api/products/upload").attach("csv", csvBuffer, "test.csv")

    expect(res.status).toBe(201)
    expect(res.body.message).toBe("CSV file processed successfully")
    expect(res.body.productsCreated).toBe(1)

    const products = await Product.find()
    expect(products.length).toBe(1)
    expect(products[0].Name).toBe("Test Product")
  })
})

