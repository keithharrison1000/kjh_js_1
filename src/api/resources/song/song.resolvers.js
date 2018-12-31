import { Song } from './song.model'

const getSong = (_, {id}, {user}) => {
  return Song.findById(id).exec()
}

const allSongs = () => {
  return Song.find({}).exec()
}

const allMySongs = (_,__,{user}) => {
  //console.log(ctx.user)
  return Song.find({user:user.id}).exec()
}


const newSong = (_, {input}) => {
  return Song.create(input)
}

const newMySong = (_, {input},{user}) => {
  input.user = user.id
  console.log(input)
  return Song.create(input)
}

const updateSong = (_, {input}) => {
  const {id, ...update} = input

  return Song.findByIdAndUpdate(id, update, {new: true}).exec()
}

const updateMySong = (_, {input},{user}) => {
  const {id, ...update} = input

  return Song.findOneAndUpdate({_id:id,user:user.id}, update, {new: true}).exec()
  
}


export const songResolvers = {
  Query: {
    allSongs,
    allMySongs,
    Song: getSong
  },

  Mutation: {
    newSong,
    newMySong,
    updateSong,
    updateMySong
  }
}
