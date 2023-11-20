import {
  Router,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { songController } from "@controllers/songs";
import { verifyRequestAuthentication } from "@middleware/verify-request-authentication";

// Express router for songs routes
export const songsRouter = Router();

// Deletes a song
songsRouter.delete(
  "/",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.deleteSong(req);

    // Goes to the next middleware
    next();
  }
);

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
  verifyRequestAuthentication,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.getFavoriteSongs(req);

    // Goes to the next middleware
    next();
  }
);

// Adds a song to the user's favorite songs
songsRouter.post(
  "/favorites/add",
  verifyRequestAuthentication,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.addFavoriteSong(req);

    // Goes to the next middleware
    next();
  }
);

// Removes a song from the user's favorite songs
songsRouter.post(
  "/favorites/remove",
  verifyRequestAuthentication,
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.removeFavoriteSong(req);

    // Goes to the next middleware
    next();
  }
);

// Adds or updates a song
songsRouter.post(
  "/add-or-update",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    await songController.addOrUpdateSong(req);

    // Goes to the next middleware
    next();
  }
);
