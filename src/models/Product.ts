import mongoose, { Document, Schema } from 'mongoose';
import { ICategory } from './Category';

export interface IAttribute {
  name: string;
  value: string;
  visible: boolean;
  global: boolean;
}

export interface IProduct extends Document {
  productId: number;
  type: string;
  sku: string;
  name: string;
  published: boolean;
  isFeatured: boolean;
  visibilityInCatalog: string;
  shortDescription: string;
  description: string;
  dateOnSaleTo: Date;
  dateOnSaleFrom: Date;
  taxStatus: string;
  taxClass: string;
  inStock: boolean;
  stock: number;
  lowStockAmount: number;
  backordersAllowed: boolean;
  soldIndividually: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  allowCustomerReviews: boolean;
  purchaseNote: string;
  salePrice: number;
  regularPrice: number;
  categories: ICategory['_id'][];
  tags: string[];
  images: string[];
  attributes: IAttribute[];
}

const productSchema = new Schema<IProduct>({
  productId: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  published: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  visibilityInCatalog: { type: String, enum: ['visible', 'catalog', 'search', 'hidden'], default: 'visible' },
  shortDescription: String,
  description: String,
  dateOnSaleTo: Date,
  dateOnSaleFrom: Date,
  taxStatus: { type: String, enum: ['taxable', 'shipping', 'none'], default: 'taxable' },
  taxClass: String,
  inStock: { type: Boolean, default: true },
  stock: { type: Number, default: 0 },
  lowStockAmount: Number,
  backordersAllowed: { type: Boolean, default: false },
  soldIndividually: { type: Boolean, default: false },
  weight: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  allowCustomerReviews: { type: Boolean, default: true },
  purchaseNote: String,
  salePrice: Number,
  regularPrice: Number,
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [String],
  images: [String],
  attributes: [{
    name: String,
    value: String,
    visible: { type: Boolean, default: true },
    global: { type: Boolean, default: true },
  }],
}, { timestamps: true });

export default mongoose.model<IProduct>('Product', productSchema);
