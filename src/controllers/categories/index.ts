import { Request as ExpressRequest } from "express";
import { getAllCategories } from "@controllers/categories/get/all";
import { getCategory } from "@controllers/categories/get/one";

// Category controller schema
type Controller = {
  getAllCategories: (arg0: ExpressRequest) => Promise<void>;
  getCategory: (arg0: ExpressRequest, catId: string) => Promise<void>;
};

// Creates the category controller
export const categoryController: Controller = {
  getAllCategories,
  getCategory,
};
