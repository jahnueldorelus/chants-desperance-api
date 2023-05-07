import { ClientSession, HydratedDocument, Model } from "mongoose";

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

export interface SongsModel extends Model<ISong, {}, ISongMethods> {
  /**
   * Deletes a song.
   * @param songId The id of the song to delete
   * @param session — The DB session to use
   */
  deleteSong: (songId: string, session?: ClientSession) => Promise<boolean>;
}

export type DBLoadedSong = HydratedDocument<ISong, ISongMethods>;
