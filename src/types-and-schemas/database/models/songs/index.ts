import { HydratedDocument, Model } from "mongoose";

export type ISong = {
  name: string;
  searchName: string;
  catId: string;
  numOfVerses: number;
  bookNum: number;
  hasChorus: boolean;
  lang: "kr" | "fr";
};

export type ISongMethods = {};

export interface SongsModel extends Model<ISong, {}, ISongMethods> {}

export type DBLoadedSong = HydratedDocument<ISong, ISongMethods>;
