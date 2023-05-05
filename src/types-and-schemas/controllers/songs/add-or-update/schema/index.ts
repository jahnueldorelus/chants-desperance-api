import Joi from "joi";

export const addOrUpdateSongSchema = {
  // The id of the book the song is in
  catId: Joi.string().token().min(24).max(24).required(),

  // Song id
  songId: Joi.string().token().min(24).max(24).allow(null).required(),

  // Number of verses in the song
  numOfVerses: Joi.number().min(1).required(),

  // The name of the song
  name: Joi.string().required(),

  // The searchable name of the song
  searchName: Joi.string()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .required(),

  // The song number
  bookNum: Joi.number().min(0).required(),

  // Determines if the song has a chorus
  hasChorus: Joi.boolean().required(),

  // The language of the song
  lang: Joi.string().valid("kr", "fr").required(),

  // The verses of the song
  verses: Joi.array()
    .items(
      Joi.object({
        // The verse number
        verseNum: Joi.number().min(1).required(),

        // Determines if the verse is a chorus
        isChorus: Joi.boolean().required(),

        // The verse
        verse: Joi.string().required(),
      })
    )
    .min(1)
    .required(),
};
