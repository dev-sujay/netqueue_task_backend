import type { Request, Response, NextFunction } from "express";
import Joi from "joi";

const filterSchema = Joi.object({
  category: Joi.string(),
  brand: Joi.string(),
  condition: Joi.string(),
  gender: Joi.string(),
  material: Joi.string(),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  inStock: Joi.boolean(),
  search: Joi.string(),
  sort: Joi.string(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1),
  fields: Joi.string(),
});

export const validateFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = filterSchema.validate(req.query);
  if (error) {
    res.status(400).json({ error: error.details[0].message });
  } else next();
};
