import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";

/**
 * Retrieves the data of one category.
 * @param req The network request
 */
export const getCategory = async (req: ExpressRequest, catId: string) => {
  try {
    const category = await dbCD.categoryModel.findOne({ _id: catId });

    if (category) {
      RequestSuccess(req, category.toJSON());
    } else {
      RequestError(
        req,
        Error("The id provided for the category is invalid")
      ).badRequest();
    }
  } catch (error) {
    // Default error
    RequestError(req, Error("Failed to retrieve category.")).server();
  }
};
