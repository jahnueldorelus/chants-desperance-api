import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../../middleware/requestError";
import { RequestSuccess } from "../../../../middleware/requestSuccess";
import { dbCD } from "../../../../services/database";

/**
 * Retrieves the list of songs in a category.
 * @param req The network request
 * @param catId The category Id
 */
export const getSongsInCategory = async (
  req: ExpressRequest,
  catId: string
) => {
  try {
    const songsInCategory = await dbCD.songModel
      .find({ catId })
      .sort({ bookNum: 1 });

    RequestSuccess(req, songsInCategory);
  } catch (error) {
    // Default error
    RequestError(
      req,
      Error("Failed to retrieve the list of songs in given category.")
    ).server();
  }
};
