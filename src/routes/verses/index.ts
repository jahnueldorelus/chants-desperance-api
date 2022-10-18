import {
  Router,
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { verseController } from "../../controllers/verses";

// Express router for verses routes
export const versesRouter = Router();

// Retrieves the list of verses by song
versesRouter.get(
  "/song/:songId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const songId = req.params.songId;
    await verseController.getVersesInSong(req, songId);

    // Goes to the next middleware
    next();
  }
);

// Retrieves a single song
versesRouter.get(
  "/:verseId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const verseId = req.params.verseId;
    await verseController.getVerse(req, verseId);

    // Goes to the next middleware
    next();
  }
);

// Adds verses to a song
versesRouter.post(
  "/new/song/:songId",
  async (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
    const songId = req.params.songId;
    await verseController.addVerses(req, songId);

    // Goes to the next middleware
    next();
  }
);
