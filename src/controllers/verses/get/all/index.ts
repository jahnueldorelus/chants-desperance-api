import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";

/**
 * Retrieves the list of verses in a song.
 * @param req The network request
 * @param songId The song Id
 */
export const getVersesInSong = async (req: ExpressRequest, songId: string) => {
  try {
    const versesInSong = await dbCD.verseModel
      .find({ songId })
      .sort({ verseNum: 1 });

    RequestSuccess(req, versesInSong);
  } catch (error) {
    // Default error
    RequestError(req, Error("Failed to retrieve the list of verses.")).server();
  }
};
