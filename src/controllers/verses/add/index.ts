import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import { Error as MongooseError } from "mongoose";

/**
 * Adds verses for a song.
 * @param req The network request
 * @param songId The id of the song to add the verses to
 */
export const addVerses = async (req: ExpressRequest, songId: string) => {
  try {
    let versesData = req.body;
    const song = await dbCD.songsModel.findOne({ _id: songId });

    // Checks if user's data contains a valid song Id
    if (!song) {
      RequestError(req, Error("The song id provided is invalid.")).badRequest();
      return;
    }

    // Adds the song id to all verses
    if (Array.isArray(versesData)) {
      versesData = versesData.map((verse) => ({ ...verse, songId }));
    } else {
      RequestError(
        req,
        Error("Please provide an array of verses.")
      ).badRequest();
      return;
    }

    const verses = await dbCD.versesModel.insertMany(versesData);

    RequestSuccess(req, verses);
  } catch (error: any) {
    // If the error is due to a validation error
    if (error instanceof MongooseError.ValidationError) {
      RequestError(
        req,
        Error(
          "The data provided to add verses is invalid.\n\nError - ".concat(
            error.message,
            "."
          )
        )
      ).badRequest();
    }

    // Default error
    else {
      RequestError(req, Error("Failed to add verses to a song.")).server();
    }
  }
};
