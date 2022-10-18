import { Request as ExpressRequest } from "express";
import { getVersesInSong } from "./get/all";
import { getVerse } from "./get/one";
import { addVerses } from "./add";

// Song controller schema
type Controller = {
  getVersesInSong: (arg0: ExpressRequest, songId: string) => Promise<void>;
  getVerse: (arg0: ExpressRequest, verseId: string) => Promise<void>;
  addVerses: (arg0: ExpressRequest, songId: string) => Promise<void>;
};

// Creates the verses controller
export const verseController: Controller = {
  getVersesInSong,
  getVerse,
  addVerses,
};
