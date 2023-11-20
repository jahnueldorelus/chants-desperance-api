import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import { connection } from "mongoose";
import Joi from "joi";
import {
  AddFavSongInfo,
  ValidAddFavSongInfo,
} from "@app-types/controllers/songs/favorites/add";
import { favoritesInfoSchema } from "@app-types/controllers/songs/favorites/schema";

// Schema validation
const ReqInfoSchema = Joi.object({
  userId: favoritesInfoSchema.userId,
  songId: favoritesInfoSchema.songId,
});

/**
 * Deterimines if the request is valid.
 * @param addFavSongInfo The request's information
 */
const validateRequest = (
  addFavSongInfo: AddFavSongInfo
): ValidAddFavSongInfo => {
  const { error, value } = ReqInfoSchema.validate(addFavSongInfo);

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
 * Adds a song to the user's favorite songs.
 * @param req The network request
 */
export const addFavoriteSong = async (req: ExpressRequest) => {
  const requestData = <AddFavSongInfo>req.body;

  const { isValid, errorMessage, validatedValue } =
    validateRequest(requestData);

  // If the request's is valid
  if (isValid) {
    const dbSession = await connection.startSession();
    dbSession.startTransaction();

    try {
      const addedSong = await dbCD.favoriteSongsModel.create(
        [{ userId: validatedValue.userId, songId: validatedValue.songId }],
        { session: dbSession }
      );

      dbSession.commitTransaction();

      if (!addedSong[0]) {
        throw Error();
      }

      RequestSuccess(req, true);
    } catch (error: any) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      // Default error
      else {
        RequestError(
          req,
          Error("Failed to add song to the user's favorites.")
        ).server();
      }
    }
  }

  // If the request is invalid
  else {
    RequestError(req, Error(errorMessage)).validation();
  }
};
