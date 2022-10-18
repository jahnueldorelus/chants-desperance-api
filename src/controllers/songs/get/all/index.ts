import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";

/**
 * Retrieves the list of all songs.
 * @param req The network request
 */
export const getAllSongs = async (req: ExpressRequest) => {
  try {
    const allSongs = await dbCD.songModel
      .find({})
      .sort({ name: 1, catId: 1, bookNum: 1, lang: 1 });

    RequestSuccess(req, allSongs);
  } catch (error) {
    // Default error
    RequestError(
      req,
      Error("Failed to retrieve the list of all songs.")
    ).server();
  }
};
