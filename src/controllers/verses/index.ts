import { Request as ExpressRequest } from "express";
import { getVersesInSong } from "@controllers/verses/get/all";
import { getVerse } from "@controllers/verses/get/one";
import { addVerses } from "@controllers/verses/add";

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
