import { HydratedDocument, Model } from "mongoose";

export type IVerse = {
  songId: string;
  verseNum: number;
  verse: string;
  isChorus: boolean;
};

export type IVerseMethods = {};

export interface VersesModel extends Model<IVerse, {}, IVerseMethods> {}

export type DBLoadedVerse = HydratedDocument<IVerse, IVerseMethods>;
