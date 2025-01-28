import mongoose, { type Document, Schema } from "mongoose"

export interface IProduct extends Document {
  ID: number
  Type: string
  SKU: string
  Name: string
  Published: number
  IsFeatured: number
  VisibilityInCatalog: string
  ShortDescription: string
  Description: string
  TaxStatus: string
  InStock: number
  Stock: number
  SalePrice: number
  RegularPrice: number
  Categories: string[]
  Images: string[]
  Brand: string
  Condition: string
  Gender: string
  Movement: string
  GoldColour: string
  Material: string
}

const ProductSchema: Schema = new Schema({
  ID: { type: Number, required: true, unique: true },
  Type: { type: String, required: true },
  SKU: { type: String, required: true, unique: true },
  Name: { type: String, required: true },
  Published: { type: Number, required: true },
  IsFeatured: { type: Number, required: true },
  VisibilityInCatalog: { type: String, required: true },
  ShortDescription: { type: String },
  Description: { type: String },
  TaxStatus: { type: String },
  InStock: { type: Number, required: true },
  Stock: { type: Number, required: true },
  SalePrice: { type: Number },
  RegularPrice: { type: Number, required: true },
  Categories: [{ type: String }],
  Images: [{ type: String }],
  Brand: { type: String },
  Condition: { type: String },
  Gender: { type: String },
  Movement: { type: String },
  GoldColour: { type: String },
  Material: { type: String },
})

// Add text index for search functionality
ProductSchema.index({
  Name: "text",
  ShortDescription: "text",
  Description: "text",
  Categories: "text",
  Brand: "text",
  Condition: "text",
  Gender: "text",
  Movement: "text",
  GoldColour: "text",
  Material: "text",
})

export default mongoose.model<IProduct>("Product", ProductSchema)

