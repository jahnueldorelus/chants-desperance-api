import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
import { connection } from "mongoose";
import { ObjectId } from "mongodb";
import Joi from "joi";
import {
  UserInfo,
  ValidUserInfo,
} from "@app-types/controllers/songs/get/favorites";

// Schema validation
const UserInfoSchema = Joi.object({
  userId: Joi.string().token().min(24).max(24).required(),
});

/**
 * Deterimines if the request's user information is valid.
 * @param userInfo The request's user information
 */
const validateUserInfo = (userInfo: UserInfo): ValidUserInfo => {
  const { error, value } = UserInfoSchema.validate(userInfo);

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
 * Retrieves the list of all songs in the user's favorites.
 * @param req The network request
 */
export const getFavoriteSongs = async (req: ExpressRequest) => {
  const requestData = <UserInfo>req.body;

  const { isValid, errorMessage, validatedValue } =
    validateUserInfo(requestData);

  // If the request's user information is valid
  if (isValid) {
    const dbSession = await connection.startSession();
    dbSession.startTransaction();

    try {
      // The user's favorite songs
      const userFavoriteSongs = await dbCD.favoriteSongsModel.find({
        userId: validatedValue.userId,
      });

      // The ids of the user's favorite songs
      const favoriteSongsIds: ObjectId[] = userFavoriteSongs.map(
        (song) => new ObjectId(song.songId)
      );

      // Song info of the user's favorite songs
      const favoriteSongsInfo = await dbCD.songModel
        .find({ _id: { $in: favoriteSongsIds } })
        .sort({ name: 1, catId: 1, bookNum: 1, lang: 1 });

      RequestSuccess(
        req,
        favoriteSongsInfo.map((song) => song.toJSON())
      );
    } catch (error) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      // Default error
      RequestError(
        req,
        Error("Failed to retrieve the list of the user's favorite songs.")
      ).server();
    }
  }

  // If the given user info from the request is invalid
  else {
    RequestError(req, Error(errorMessage)).validation();
  }
};
