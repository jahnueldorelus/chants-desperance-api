import { model, Schema } from "mongoose";

import {
  ICategory,
  ICategoryMethods,
  CategoriesModel,
} from "@app-types/database/models/categories";

/**
 * ANY CHANGES MADE TO THE SCHEMA MUST ALSO BE MADE IN MODEL'S TYPES
 */
const categoriesSchema = new Schema<
  ICategory,
  CategoriesModel,
  ICategoryMethods
>({
  name: {
    type: String,
    required: true,
    min: 1,
  },
  numOfSongs: {
    type: Number,
    required: true,
    min: 1,
    max: 335,
  },
  lang: {
    type: String,
    enum: ["kr", "fr", "kr-fr"],
  },
});

export const categoriesModel = model<ICategory, CategoriesModel>(
  "categories",
  categoriesSchema,
  "categories"
);
