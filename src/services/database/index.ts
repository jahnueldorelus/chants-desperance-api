import { envNames } from "@startup/config";
import { connect, connection } from "mongoose";
import { categoriesModel } from "./models/categories";
import { versesModel } from "./models/verses";
import { songsModel } from "./models/songs";
import { favoriteSongsModel } from "./models/favorite-songs";

const connectToDatabase = () => {
  connect(process.env[envNames.db.address] || "", {
    dbName: process.env[envNames.db.name],
    authSource: process.env[envNames.db.name],
    auth: {
      username: process.env[envNames.db.user],
      password: process.env[envNames.db.password],
    },
    authMechanism: "DEFAULT",
  });

  connection.once("open", () =>
    console.log("Connected to MongoDB successfully")
  );

  return { categoriesModel, songsModel, versesModel, favoriteSongsModel };
};

export const dbCD = connectToDatabase();
