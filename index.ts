import express from "express";
import { addServerRoutes } from "./src/startup/routes";
import { addStartMiddleware, addEndMiddleware } from "./src/startup/middleware";

// Express server
const server = express();

// Adds all the starting middlware used by the server
addStartMiddleware(server);

// Adds all routes used by the server
addServerRoutes(server);

// Adds all the ending middlware used by the server
addEndMiddleware(server);

// The port for the server to listen on
const port: number | string = process.env.PORT ? 4001 : 4000;

// The application
module.exports = server.listen(port, () => {
  console.log("Connected to port", port, "successfully.");
});
