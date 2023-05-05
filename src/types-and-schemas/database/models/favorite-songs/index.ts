import { HydratedDocument, Model } from "mongoose";

export type IFavoriteSong = {
  userId: string;
  songId: string;
};

export type IFavoriteSongMethods = {};

export interface FavoriteSongsModel
  extends Model<IFavoriteSong, {}, IFavoriteSongMethods> {}

export type DBLoadedFavoriteSong = HydratedDocument<
  IFavoriteSong,
  IFavoriteSongMethods
>;
