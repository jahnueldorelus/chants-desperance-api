import { model, Schema } from "mongoose";

import {
  IFavoriteSong,
  IFavoriteSongMethods,
  FavoriteSongsModel,
} from "@app-types/database/models/favorite-songs";

/**
 * ANY CHANGES MADE TO THE SCHEMA MUST ALSO BE MADE IN MODEL'S TYPES
 */
const favoriteSongsSchema = new Schema<
  IFavoriteSong,
  FavoriteSongsModel,
  IFavoriteSongMethods
>({
  userId: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24,
  },
  songId: {
    type: String,
    required: true,
    minlength: 24,
    maxlength: 24,
  },
});

export const favoriteSongsModel = model<IFavoriteSong, FavoriteSongsModel>(
  "favorite-songs",
  favoriteSongsSchema,
  "favorite-songs"
);
