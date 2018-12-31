import { Playlist } from './playlist.model'

const getPlaylist = (_, {id}) => {
  return Playlist.findById(id).exec()
}

const allPlaylists = () => {
  return Playlist.find({}).exec()
}

const allMyPlaylists = (_,__,{user}) => {
  //console.log(ctx.user)
  return Playlist.find({user:user.id}).exec()
}

const newPlaylist = (_, {input}) => {
  return Playlist.create(input)
}

const newMyPlaylist = (_, {input},{user}) => {
  input.user = user.id
  console.log(input)
  return Playlist.create(input)
}

const updatePlaylist = (_, {input}) => {
  const {id, ...update} = input

  return Playlist.findByIdAndUpdate(id, update, {new: true}).exec()
}

const updateMyPlaylist = (_, {input},{user}) => {
  const {id, ...update} = input

  return Playlist.findOneAndUpdate({_id:id,user:user.id}, update, {new: true}).exec()
  
}

export const playlistResolvers = {
  Query: {
    allPlaylists,
    allMyPlaylists,
    Playlist: getPlaylist,
  },

  Mutation: {
    newPlaylist,
    newMyPlaylist,
    updatePlaylist,
    updateMyPlaylist
  },

  Playlist: {
    async songs(playlist) {
      const populated = await playlist
        .populate('songs')
        .execPopulate()

      return populated.songs
    },
    async user(playlist) {
      const populated = await playlist
        .populate('user')
        .execPopulate()

      return populated.user
    },

  }
}
