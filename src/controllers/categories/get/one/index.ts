import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the data of one category.
 * @param req The network request
 */
export const getCategory = async (req: ExpressRequest, catId: string) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const category = await dbCD.categoriesModel.findById(catId, null, {
      session: dbSession,
    });

    await dbSession.commitTransaction();

    if (category) {
      RequestSuccess(req, category.toJSON());
    } else {
      RequestError(
        req,
        Error("The id provided for the category is invalid")
      ).badRequest();
    }
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    RequestError(req, Error("Failed to retrieve category.")).server();
  } finally {
    await dbSession.endSession();
  }
};
