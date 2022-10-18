import { Express } from "express";
import { categoriesRouter } from "../../routes/categories";
import { songsRouter } from "../../routes/songs";
import { versesRouter } from "../../routes/verses";

/**
 * Adds all the routes to an Express server
 * @param server The Express server to add all the routes to
 */
export const addServerRoutes = (server: Express): void => {
  // Handles category requests
  server.use("/api/categories", categoriesRouter);

  // Handles song requests
  server.use("/api/songs", songsRouter);

  // Handles verse requests
  server.use("/api/verses", versesRouter);
};
