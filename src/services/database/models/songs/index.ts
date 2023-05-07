import { ClientSession, connection, model, Schema } from "mongoose";

import {
  ISong,
  ISongMethods,
  SongsModel,
} from "@app-types/database/models/songs";
import { dbCD } from "@services/database";

/**
 * ANY CHANGES MADE TO THE SCHEMA MUST ALSO BE MADE IN MODEL'S TYPES
 */
const songsSchema = new Schema<ISong, SongsModel, ISongMethods>({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  searchName: {
    type: String,
    required: true,
    minlength: 1,
  },
  catId: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24,
  },
  numOfVerses: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  bookNum: {
    type: Number,
    required: true,
    min: 0,
    max: 335,
  },
  hasChorus: {
    type: Boolean,
    required: true,
  },
  lang: {
    type: String,
    required: true,
    enum: ["kr", "fr"],
  },
});

songsSchema.static(
  "deleteSong",
  async function (songId: string, givenSession: ClientSession) {
    const dbSession = givenSession
      ? givenSession
      : await connection.startSession();

    try {
      // Creates a new transaction if no session was provided
      if (!givenSession || !givenSession.inTransaction()) {
        dbSession.startTransaction();
      }

      const deletedSong = await this.findByIdAndDelete(songId, {
        session: givenSession,
      });

      if (!deletedSong) {
        throw Error();
      }

      await dbCD.versesModel.deleteMany({ songId }, { session: dbSession });

      // Commits the transaction if it was created within this method
      if (!givenSession) {
        await dbSession.commitTransaction();
      }
      return true;
    } catch (error) {
      // Aborts the transaction if it was created within this method
      if (!givenSession && dbSession.inTransaction()) {
        await dbSession.abortTransaction();
      }

      return false;
    } finally {
      // Ends the session if it was created within this method
      if (!givenSession) {
        await dbSession.endSession();
      }
    }
  }
);

export const songsModel = model<ISong, SongsModel>(
  "songs",
  songsSchema,
  "songs"
);
