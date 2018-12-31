import mongoose from 'mongoose'

export const schema = {
  title: {
    type: String,
    required: [true, 'Song must have a title']
  },

  url: String,

  album: String,

  artist: String,

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },

  favorite: {
    type: Boolean,
    required: true,
    default: false
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'

  }
}


const songSchema = new mongoose.Schema(schema)

export const Song = mongoose.model('song', songSchema)
