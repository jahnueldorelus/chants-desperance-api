import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";

/**
 * Retrieves the data of one song.
 * @param req The network request
 * @param songId The song Id
 */
export const getSong = async (req: ExpressRequest, songId: string) => {
  try {
    const song = await dbCD.songModel.findOne({ _id: songId });

    if (song) {
      RequestSuccess(req, song.toJSON());
    } else {
      RequestError(
        req,
        Error("The id provided for the song is invalid")
      ).badRequest();
    }
  } catch (error) {
    // Default error
    RequestError(req, Error("Failed to retrieve the list of songs.")).server();
  }
};
