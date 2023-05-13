import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the list of song categories.
 * @param req The network request
 */
export const getAllCategories = async (req: ExpressRequest) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const categories = await dbCD.categoriesModel
      .find({}, null, { session: dbSession })
      .sort({ name: 1, lang: 1 });

    await dbSession.commitTransaction();

    RequestSuccess(req, categories);
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    RequestError(
      req,
      Error("Failed to retrieve the list of categories.")
    ).server();
  } finally {
    dbSession.endSession();
  }
};
