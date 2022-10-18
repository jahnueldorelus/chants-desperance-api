import {
  Router,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { categoryController } from "../../controllers/categories";

// Express router for category routes
export const categoriesRouter = Router();

// Retrieves the list of categories
categoriesRouter.get(
  "/all",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await categoryController.getAllCategories(req);

    // Goes to the next middleware
    next();
  }
);

// Retrieves a single category
categoriesRouter.get(
  "/:catId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const categoryId = req.params.catId;
    await categoryController.getCategory(req, categoryId);

    // Goes to the next middleware
    next();
  }
);
