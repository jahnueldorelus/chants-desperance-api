import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";

/**
 * Retrieves the list of song categories.
 * @param req The network request
 */
export const getAllCategories = async (req: ExpressRequest) => {
  try {
    const categories = await dbCD.categoryModel
      .find({})
      .sort({ name: 1, lang: 1 });

    RequestSuccess(req, categories);
  } catch (error) {
    // Default error
    RequestError(
      req,
      Error("Failed to retrieve the list of categories.")
    ).server();
  }
};
