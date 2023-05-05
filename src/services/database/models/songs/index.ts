import { model, Schema } from "mongoose";

import {
  ISong,
  ISongMethods,
  SongsModel,
} from "@app-types/database/models/songs";

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

export const songsModel = model<ISong, SongsModel>(
  "songs",
  songsSchema,
  "songs"
);
