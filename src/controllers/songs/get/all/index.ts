import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the list of all songs.
 * @param req The network request
 */
export const getAllSongs = async (req: ExpressRequest) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const allSongs = await dbCD.songsModel
      .find({}, null, { session: dbSession })
      .sort({ name: 1, catId: 1, bookNum: 1, lang: 1 });

    await dbSession.commitTransaction();

    RequestSuccess(req, allSongs);
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    RequestError(
      req,
      Error("Failed to retrieve the list of all songs.")
    ).server();
  } finally {
    await dbSession.endSession();
  }
};
