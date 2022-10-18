import { Request as ExpressRequest } from "express";
import { getSongsInCategory } from "./get/category";
import { getAllSongs } from "./get/all";
import { getSong } from "./get/one";
import { addSong } from "./add";
import { getAllFavoriteSongs } from "./get/favorites";

// Song controller schema
type Controller = {
  getSongsInCategory: (
    arg0: ExpressRequest,
    categoryId: string
  ) => Promise<void>;
  getAllSongs: (arg0: ExpressRequest) => Promise<void>;
  getSong: (arg0: ExpressRequest, songId: string) => Promise<void>;
  addSong: (arg0: ExpressRequest) => Promise<void>;
  getAllFavoriteSongs: (
    arg0: ExpressRequest,
    songIds: string[]
  ) => Promise<void>;
};

// Creates the songs controller
export const songController: Controller = {
  getSongsInCategory,
  getAllSongs,
  getSong,
  addSong,
  getAllFavoriteSongs,
};
