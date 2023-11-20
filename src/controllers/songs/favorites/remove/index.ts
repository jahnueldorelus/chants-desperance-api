import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import { connection } from "mongoose";
import Joi from "joi";
import {
  RemoveFavSongInfo,
  ValidRemoveFavSongInfo,
} from "@app-types/controllers/songs/favorites/remove";
import { favoritesInfoSchema } from "@app-types/controllers/songs/favorites/schema";
import { errorMessages } from "@services/errorMessages";

// Schema validation
const ReqInfoSchema = Joi.object({
  userId: favoritesInfoSchema.userId,
  songId: favoritesInfoSchema.songId,
});

/**
 * Deterimines if the request is valid.
 * @param removeFavSongInfo The request's information
 */
const validateRequest = (
  removeFavSongInfo: RemoveFavSongInfo
): ValidRemoveFavSongInfo => {
  const { error, value } = ReqInfoSchema.validate(removeFavSongInfo);

  if (error) {
    return {
      errorMessage: error.message,
      isValid: false,
      validatedValue: undefined,
    };
  } else {
    return { errorMessage: null, isValid: true, validatedValue: value };
  }
};

/**
 * Removes a song from the user's favorite songs.
 * @param req The network request
 */
export const removeFavoriteSong = async (req: ExpressRequest) => {
  const requestData = <RemoveFavSongInfo>req.body;

  const { isValid, errorMessage, validatedValue } =
    validateRequest(requestData);

  // If the request's is valid
  if (isValid) {
    const dbSession = await connection.startSession();
    dbSession.startTransaction();

    try {
      const removedFavoriteSong =
        await dbCD.favoriteSongsModel.findOneAndDelete(
          { userId: validatedValue.userId, songId: validatedValue.songId },
          { session: dbSession }
        );

      if (!removedFavoriteSong) {
        throw Error(errorMessages.badRequest);
      }

      dbSession.commitTransaction();

      RequestSuccess(req, true);
    } catch (error: any) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      // No record of the songs exists in database
      if (error.message === errorMessages.badRequest) {
        RequestError(
          req,
          Error(
            "The user/song is invalid or the song is not in the user's list of favorites."
          )
        ).server();
      }

      // Default error
      else {
        RequestError(
          req,
          Error("Failed to remove song from the user's favorites.")
        ).server();
      }
    }
  }

  // If the request is invalid
  else {
    RequestError(req, Error(errorMessage)).validation();
  }
};
