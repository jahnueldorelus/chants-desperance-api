import { JoiValidationResults } from "@app-types/joi-validation";

export type DeleteSongInfo = {
  songId: string;
};

export type ValidDeleteSongInfo = JoiValidationResults<DeleteSongInfo>;
