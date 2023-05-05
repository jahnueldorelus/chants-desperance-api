import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the list of verses in a song.
 * @param req The network request
 * @param songId The song Id
 */
export const getVersesInSong = async (req: ExpressRequest, songId: string) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const versesInSong = await dbCD.versesModel
      .find({ songId }, null, { session: dbSession })
      .sort({ verseNum: 1 });

    await dbSession.commitTransaction();

    RequestSuccess(req, versesInSong);
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }
    // Default error
    RequestError(req, Error("Failed to retrieve the list of verses.")).server();
  } finally {
    await dbSession.endSession();
  }
};
