import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the list of songs in a category.
 * @param req The network request
 * @param catId The category Id
 */
export const getSongsInCategory = async (
  req: ExpressRequest,
  catId: string
) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const songsInCategory = await dbCD.songsModel
      .find({ catId }, null, { session: dbSession })
      .sort({ bookNum: 1 });

    await dbSession.commitTransaction();

    RequestSuccess(req, songsInCategory);
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    RequestError(
      req,
      Error("Failed to retrieve the list of songs in given category.")
    ).server();
  } finally {
    await dbSession.endSession();
  }
};
