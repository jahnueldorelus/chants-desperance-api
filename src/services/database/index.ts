import { connect, connection, model, Schema } from "mongoose";

const connectToDatabase = () => {
  connect(process.env.DB_ADDRESS || "", {
    dbName: process.env.DB_NAME,
    authSource: process.env.DB_NAME,
    auth: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    authMechanism: "DEFAULT",
  });

  connection.once("open", () =>
    console.log("Connected to MongoDB successfully")
  );

  const categoryModel = model(
    "category",
    new Schema({
      name: {
        type: String,
        required: true,
        min: 1,
      },
      numOfSongs: {
        type: Number,
        required: true,
        min: 1,
        max: 335,
      },
      lang: {
        type: String,
        enum: ["kr", "fr", "kr-fr"],
      },
    }),
    "categories"
  );

  const songModel = model(
    "song",
    new Schema({
      name: {
        type: String,
        required: true,
        minlength: 1,
      },
      catId: {
        type: String,
        required: true,
        minlength: 24,
        maxlength: 24,
      },
      numOfVerses: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
      },
      bookNum: {
        type: Number,
        required: true,
        min: 0,
        max: 335,
      },
      hasChorus: {
        type: Boolean,
        required: true,
      },
      lang: {
        type: String,
        required: true,
        enum: ["kr", "fr"],
      },
    })
  );

  const verseModel = model(
    "verse",
    new Schema({
      songId: {
        type: String,
        required: true,
        minlength: 24,
        maxlength: 24,
      },
      verseNum: {
        type: Number,
        min: 1,
        max: 10,
      },
      verse: {
        type: String,
        minlength: 1,
      },
      isChorus: {
        type: Boolean,
        minlength: 1,
      },
    })
  );

  return { categoryModel, songModel, verseModel };
};

export const dbCD = connectToDatabase();
