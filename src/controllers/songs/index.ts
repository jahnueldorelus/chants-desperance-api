import { Request as ExpressRequest } from "express";
import { getSongsInCategory } from "@controllers/songs/get/category";
import { getAllSongs } from "@controllers/songs/get/all";
import { getSong } from "@controllers/songs/get/one";
import { deleteSong } from "@controllers/songs/delete/one";
import { addOrUpdateSong } from "@controllers/songs/add-or-update";
import { getFavoriteSongs } from "@controllers/songs/favorites/get";
import { addFavoriteSong } from "@controllers/songs/favorites/add";
import { removeFavoriteSong } from "@controllers/songs/favorites/remove";

// Song controller schema
type Controller = {
  getSongsInCategory: (
    arg0: ExpressRequest,
    categoryId: string
  ) => Promise<void>;
  getAllSongs: (arg0: ExpressRequest) => Promise<void>;
  getSong: (arg0: ExpressRequest, songId: string) => Promise<void>;
  deleteSong: (arg0: ExpressRequest) => Promise<void>;
  addOrUpdateSong: (arg0: ExpressRequest) => Promise<void>;
  getFavoriteSongs: (arg0: ExpressRequest) => Promise<void>;
  addFavoriteSong: (arg0: ExpressRequest) => Promise<void>;
  removeFavoriteSong: (arg0: ExpressRequest) => Promise<void>;
};

// Creates the songs controller
export const songController: Controller = {
  getSongsInCategory,
  getAllSongs,
  getSong,
  deleteSong,
  addOrUpdateSong,
  getFavoriteSongs,
  addFavoriteSong,
  removeFavoriteSong,
};
