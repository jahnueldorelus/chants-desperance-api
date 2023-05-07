import { Request as ExpressRequest } from "express";
import { RequestError } from "@middleware/requestError";
import { RequestSuccess } from "@middleware/requestSuccess";
import { dbCD } from "@services/database";
// import { Error as MongooseError } from "mongoose";
import {
  AddOrUpdateSongInfo,
  ValidAddOrUpdateSongInfo,
} from "@app-types/controllers/songs/add-or-update";
import { addOrUpdateSongSchema } from "@app-types/controllers/songs/add-or-update/schema";
import Joi from "joi";
import { errorMessages } from "@services/errorMessages";
import { connection } from "mongoose";
import { ISong } from "@app-types/database/models/songs";
import { IVerse } from "@app-types/database/models/verses";

// Schema validation
const ReqInfoSchema = Joi.object({
  catId: addOrUpdateSongSchema.catId,
  songId: addOrUpdateSongSchema.songId,
  numOfVerses: addOrUpdateSongSchema.numOfVerses,
  name: addOrUpdateSongSchema.name,
  searchName: addOrUpdateSongSchema.searchName,
  bookNum: addOrUpdateSongSchema.bookNum,
  hasChorus: addOrUpdateSongSchema.hasChorus,
  lang: addOrUpdateSongSchema.lang,
  verses: addOrUpdateSongSchema.verses,
});

/**
 * Deterimines if the request is valid.
 * @param addOrUpdateSongInfo The request's information
 */
const validateRequest = (
  addOrUpdateSongInfo: AddOrUpdateSongInfo
): ValidAddOrUpdateSongInfo => {
  const { error, value } = ReqInfoSchema.validate(addOrUpdateSongInfo);

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
 * Adds or updates a song.
 * @param req The network request
 */
export const addOrUpdateSong = async (req: ExpressRequest) => {
  const requestData = <AddOrUpdateSongInfo>req.body;

  const { isValid, errorMessage, validatedValue } =
    validateRequest(requestData);

  // If the request's is valid
  if (isValid) {
    const dbSession = await connection.startSession();

    try {
      dbSession.startTransaction();

      const newSongInfo: ISong = {
        bookNum: validatedValue.bookNum,
        catId: validatedValue.catId,
        hasChorus: validatedValue.hasChorus,
        lang: <"kr" | "fr">validatedValue.lang,
        name: validatedValue.name,
        numOfVerses: validatedValue.numOfVerses,
        searchName: validatedValue.searchName,
      };

      // Creates a new song
      if (!validatedValue.songId) {
        const category = await dbCD.categoriesModel.findById(
          validatedValue.catId,
          null,
          { session: dbSession }
        );

        if (!category) {
          throw Error(errorMessages.badRequest);
        }

        const [createdSong] = await dbCD.songsModel.create([newSongInfo], {
          session: dbSession,
        });

        if (!createdSong) {
          throw Error();
        }

        const newVersesInfo: IVerse[] = validatedValue.verses.map((item) => ({
          isChorus: item.isChorus,
          songId: createdSong.id,
          verse: item.verse,
          verseNum: item.verseNum,
        }));

        const addedVerses = await dbCD.versesModel.insertMany(newVersesInfo, {
          session: dbSession,
        });

        if (!addedVerses) {
          throw Error();
        }

        await dbSession.commitTransaction();

        RequestSuccess(req, true);
      }

      // Updates a song
      else {
        const updatedSong = await dbCD.songsModel.findByIdAndUpdate(
          validatedValue.songId,
          newSongInfo,
          { session: dbSession, new: true }
        );

        if (!updatedSong) {
          throw Error(errorMessages.badRequest);
        }

        updatedSong.catId = validatedValue.catId;
        updatedSong.bookNum = validatedValue.bookNum;
        updatedSong.hasChorus = validatedValue.hasChorus;
        updatedSong.lang = <"kr" | "fr">validatedValue.lang;
        updatedSong.numOfVerses = validatedValue.numOfVerses;
        updatedSong.searchName = validatedValue.searchName;
        updatedSong.name = validatedValue.name;
        await updatedSong.save({ session: dbSession });

        const deletedAllVerses = await dbCD.versesModel.deleteMany(
          { songId: validatedValue.songId },
          { session: dbSession }
        );

        if (!deletedAllVerses) {
          throw Error();
        }

        const updatedAllVerses = await validatedValue.verses.reduce(
          async (prevValue, item) => {
            const previousVersesUpdated = await prevValue;

            const verseInfo: IVerse = {
              isChorus: item.isChorus,
              songId: updatedSong.id,
              verse: item.verse,
              verseNum: item.verseNum,
            };

            const [verse] = await dbCD.versesModel.create([verseInfo], null, {
              session: dbSession,
            });

            return previousVersesUpdated && !!verse;
          },
          Promise.resolve(true)
        );

        if (!updatedAllVerses) {
          throw Error(errorMessages.validationFail);
        }

        await dbSession.commitTransaction();

        RequestSuccess(req, true);
      }
    } catch (error: any) {
      if (dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      // Invalid category id provided
      if (error.message === errorMessages.badRequest) {
        RequestError(
          req,
          Error("The category or song id provided is invalid.")
        ).badRequest();
      }

      // Default error
      else {
        RequestError(
          req,
          Error(
            validatedValue.songId
              ? "Failed to update the song."
              : "Failed to create a song."
          )
        ).server();
      }
    } finally {
      await dbSession.endSession();
    }
  }
  // If the request is invalid
  else {
    RequestError(req, Error(errorMessage)).validation();
  }
};
