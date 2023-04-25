import {
  Router,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { songController } from "@controllers/songs";

// Express router for songs routes
export const songsRouter = Router();

// Retrieves all songs
songsRouter.get(
  "/all",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.getAllSongs(req);

    // Goes to the next middleware
    next();
  }
);

// Retrieves the list of songs by category
songsRouter.get(
  "/all/category/:catId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const categoryId = req.params["catId"] || "";
    await songController.getSongsInCategory(req, categoryId);

    // Goes to the next middleware
    next();
  }
);

// Retrieves a single song
songsRouter.get(
  "/:songId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const songId = req.params["songId"] || "";
    await songController.getSong(req, songId);

    // Goes to the next middleware
    next();
  }
);

// Retrieves the list of a user's favorite songs
songsRouter.get(
  "/favorites",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.getFavoriteSongs(req);

    // Goes to the next middleware
    next();
  }
);

// Adds a song to the user's favorite songs
songsRouter.post(
  "/favorites/add",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.addFavoriteSong(req);

    // Goes to the next middleware
    next();
  }
);

// Removes a song from the user's favorite songs
songsRouter.post(
  "/favorites/remove",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.removeFavoriteSong(req);

    // Goes to the next middleware
    next();
  }
);

// Adds a single song
songsRouter.post(
  "/new",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.addSong(req);

    // Goes to the next middleware
    next();
  }
);
