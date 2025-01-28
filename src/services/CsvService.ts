import csv from "csv-parser";
import fs from "fs";
import { Readable } from "stream";
import type { IProduct } from "../models/Product";
import Logger from "../utils/logger";

class CsvService {
  async parseCsvFile(file: Express.Multer.File): Promise<Partial<IProduct>[]> {
    const results: Partial<IProduct>[] = [];

    return new Promise((resolve, reject) => {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      readableStream
        .pipe(
          csv({
            mapHeaders: ({ header }) => header.trim(),
          })
        )
        .on("data", (data) => {
          try {
            results.push(this.transformCsvRow(data));
          } catch (error: any) {
            Logger.warn(`Skipping row due to error: ${error.message}`, {
              row: data,
            });
          }
        })
        .on("end", () => {
          Logger.info(
            `CSV parsing completed. ${results.length} valid rows processed.`
          );
          resolve(results);
        })
        .on("error", (error) => {
          Logger.error("Error parsing CSV", { error });
          reject(error);
        });
    });
  }

  private transformCsvRow(row: any): Partial<IProduct> {
    const id = Number.parseInt(row.ID);
    if (isNaN(id)) {
      throw new Error(`Invalid ID: ${row.ID}`);
    }

    return {
      ID: id,
      Type: row.Type,
      SKU: row.SKU,
      Name: row.Name,
      Published: Number.parseInt(row.Published) || 0,
      IsFeatured: Number.parseInt(row["Is featured?"]) || 0,
      VisibilityInCatalog: row["Visibility in catalog"],
      ShortDescription: row["Short description"],
      Description: row.Description,
      TaxStatus: row["Tax status"],
      InStock: Number.parseInt(row["In stock?"]) || 0,
      Stock: Number.parseInt(row.Stock) || 0,
      SalePrice: Number.parseFloat(row["Sale price"]) || 0,
      RegularPrice: Number.parseFloat(row["Regular price"]) || 0,
      Categories: row.Categories
        ? row.Categories.split(",").map((c: string) => c.trim())
        : [],
      Images: row.Images
        ? row.Images.split(",").map((i: string) => i.trim())
        : [],
      Brand: row["Attribute 1 value(s)"],
      Condition: row["Attribute 2 value(s)"],
      Gender: row["Attribute 3 value(s)"],
      Movement: row["Attribute 4 value(s)"],
      GoldColour: row["Attribute 5 value(s)"],
      Material: row["Attribute 6 value(s)"],
    };
  }
}

export default new CsvService();
