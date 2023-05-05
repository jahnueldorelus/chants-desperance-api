import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
import { connection } from "mongoose";

/**
 * Retrieves the data of one song.
 * @param req The network request
 * @param songId The song Id
 */
export const getSong = async (req: ExpressRequest, songId: string) => {
  const dbSession = await connection.startSession();

  try {
    dbSession.startTransaction();

    const song = await dbCD.songsModel.findOne({ _id: songId }, null, {
      session: dbSession,
    });

    await dbSession.commitTransaction();

    if (song) {
      RequestSuccess(req, song.toJSON());
    } else {
      RequestError(
        req,
        Error("The id provided for the song is invalid")
      ).badRequest();
    }
  } catch (error) {
    if (dbSession.inTransaction()) {
      await dbSession.abortTransaction();
    }

    RequestError(req, Error("Failed to retrieve the list of songs.")).server();
  } finally {
    await dbSession.endSession();
  }
};
