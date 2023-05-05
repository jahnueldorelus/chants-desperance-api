import { HydratedDocument, Model } from "mongoose";

export type ICategory = {
  name: string;
  numOfSongs: number;
  lang: "kr" | "fr" | "kr-fr";
};

export type ICategoryMethods = {};

export interface CategoriesModel
  extends Model<ICategory, {}, ICategoryMethods> {}

export type DBLoadedCategory = HydratedDocument<ICategory, ICategoryMethods>;
