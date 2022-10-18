import { Request as ExpressRequest } from "express";
import { RequestError } from "../../../middleware/requestError";
import { RequestSuccess } from "../../../middleware/requestSuccess";
import { dbCD } from "../../../services/database";
import { Error as MongooseError } from "mongoose";

/**
 * Adds a song
 * @param req The network request
 */
export const addSong = async (req: ExpressRequest) => {
  try {
    const songData = req.body;

    const categories = await dbCD.categoryModel.find().select({ _id: 1 });
    const categoryIds = categories.map((category) => category._id.toString());

    // Checks if user's data contains a valid category Id
    if (!categoryIds.includes(songData.catId)) {
      RequestError(
        req,
        Error("The category id provided is invalid.")
      ).badRequest();
      return;
    }

    const song = new dbCD.songModel(songData);
    await song.save();

    RequestSuccess(req, song.toJSON());
  } catch (error: any) {
    // If the error is due to a validation error
    if (error instanceof MongooseError.ValidationError) {
      RequestError(
        req,
        Error(
          "The data provided to create a new song is invalid.\n\nError - ".concat(
            error.message,
            "."
          )
        )
      ).badRequest();
    }

    // Default error
    else {
      RequestError(req, Error("Failed to create a new song.")).server();
    }
  }
};
