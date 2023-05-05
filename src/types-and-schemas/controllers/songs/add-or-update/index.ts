import { JoiValidationResults } from "@app-types/joi-validation";

export type AddOrUpdateSongInfo = {
  catId: string;
  songId: string;
  numOfVerses: number;
  name: string;
  searchName: string;
  bookNum: number;
  hasChorus: boolean;
  lang: string;
  verses: AddOrUpdateSongVerse[];
};

type AddOrUpdateSongVerse = {
  verseId: string;
  verseNum: number;
  isChorus: boolean;
  verse: string;
};

export type ValidAddOrUpdateSongInfo =
  JoiValidationResults<AddOrUpdateSongInfo>;
