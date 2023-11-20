import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/request-error";
import { RequestSuccess } from "@middleware/request-success";
import { dbCD } from "@services/database";
import Joi from "joi";
import { connection } from "mongoose";
import {
  DeleteSongInfo,
  ValidDeleteSongInfo,
} from "@app-types/controllers/songs/delete";

// Schema validation
const ReqInfoSchema = Joi.object({
  songId: Joi.string().token().min(24).max(24).required(),
});

/**
 * Deterimines if the request is valid.
 * @param deleteSongInfo The request's information
 */
const validateRequest = (
  deleteSongInfo: DeleteSongInfo
): ValidDeleteSongInfo => {
  const { error, value } = ReqInfoSchema.validate(deleteSongInfo);

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
 * Deletes a song.
 * @param req The network request
 */
export const deleteSong = async (req: ExpressRequest) => {
  const requestData = <DeleteSongInfo>req.body;

  const { isValid, errorMessage, validatedValue } =
    validateRequest(requestData);

  // If the request's is valid
  if (isValid) {
    const dbSession = await connection.startSession();

    try {
      dbSession.startTransaction();

      const deletedSong = await dbCD.songsModel.deleteSong(
        validatedValue.songId,
        dbSession
      );

      if (!deletedSong) {
        throw Error();
      }

      await dbSession.commitTransaction();

      RequestSuccess(req, true);
    } catch (error: any) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      RequestError(req, Error("Failed to delete the song")).server();
    } finally {
      await dbSession.endSession();
    }
  }
  // If the request is invalid
  else {
    RequestError(req, Error(errorMessage)).validation();
  }
};
