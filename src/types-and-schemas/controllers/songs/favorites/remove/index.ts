import { JoiValidationResults } from "@app-types/joi-validation";

export type RemoveFavSongInfo = {
  userId: string;
  songId: string;
};

export type ValidRemoveFavSongInfo = JoiValidationResults<RemoveFavSongInfo>;
