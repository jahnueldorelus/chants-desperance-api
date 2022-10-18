import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";
import { ObjectId } from "mongodb";

/**
 * Retrieves the list of all songs in the user's favorites.
 * @param req The network request
 */
export const getAllFavoriteSongs = async (
  req: ExpressRequest,
  songsIds: string[]
) => {
  try {
    if (!Array.isArray(songsIds)) {
      RequestError(
        req,
        Error("A list of song ids were not provided.")
      ).badRequest();
    } else {
      const songObjectIds = songsIds.map((songId) => new ObjectId(songId));
      const allFavoriteSongs = await dbCD.songModel
        .find({ _id: { $in: songObjectIds } })
        .sort({ name: 1, catId: 1, bookNum: 1, lang: 1 });

      RequestSuccess(req, allFavoriteSongs);
    }
  } catch (error) {
    // Default error
    RequestError(
      req,
      Error("Failed to retrieve the list of the user's favorite songs.")
    ).server();
  }
};
