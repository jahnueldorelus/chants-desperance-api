import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";

/**
 * Retrieves the data of a verse.
 * @param req The network request
 * @param verseId The song Id
 */
export const getVerse = async (req: ExpressRequest, verseId: string) => {
  try {
    const verse = await dbCD.versesModel.findOne({ _id: verseId });

    if (verse) {
      RequestSuccess(req, verse);
    } else {
      RequestError(
        req,
        Error("The id provided for the verse is invalid")
      ).badRequest();
    }
  } catch (error) {
    // Default error
    RequestError(req, Error("Failed to retrieve the list of verses.")).server();
  }
};
