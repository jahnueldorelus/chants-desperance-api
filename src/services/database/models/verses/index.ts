import { model, Schema } from "mongoose";

import {
  IVerse,
  IVerseMethods,
  VersesModel,
} from "@app-types/database/models/verses";

/**
 * ANY CHANGES MADE TO THE SCHEMA MUST ALSO BE MADE IN MODEL'S TYPES
 */
const versesSchema = new Schema<IVerse, VersesModel, IVerseMethods>({
  songId: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24,
  },
  verseNum: {
    type: Number,
    min: 1,
    max: 10,
  },
  verse: {
    type: String,
    minlength: 1,
  },
  isChorus: {
    type: Boolean,
    minlength: 1,
  },
});

export const versesModel = model<IVerse, VersesModel>(
  "verses",
  versesSchema,
  "verses"
);
