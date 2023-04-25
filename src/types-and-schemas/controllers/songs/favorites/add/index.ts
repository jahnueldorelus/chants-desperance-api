import { JoiValidationResults } from "@app-types/joi-validation";

export type AddFavSongInfo = {
  userId: string;
  songId: string;
};

export type ValidAddFavSongInfo = JoiValidationResults<AddFavSongInfo>;
