import { User, getObjectId } from './user.model'
import merge from 'lodash.merge'
import { verifyUserGraphQL, createUserGraphQL } from '../../modules/auth';

const getMe = (_, __, ctx) => {
  //console.log(ctx.req.authorized)
  return ctx.user
}

const allUsers = () => {
  return User.find({}).exec()
}

const signin = (_, {input},ctx) => {
  //console.log(input)
  //console.log(ctx.req.body)
  return verifyUserGraphQL(input)
  
  //return {id:'123', username:'keith', token:'1234'}
}

const signup = (_, {input},ctx) => {
  
  return createUserGraphQL(input)
}

const removeUser = (_, {id},ctx) => {
  console.log(id)
  const objectId = getObjectId(id)
  console.log(objectId)
  return User.findByIdAndRemove(objectId).exec()
}

const updateUser = async (_, {input},ctx) =>   {
  const {id, ...update} = input
  //console.log(input)
  //console.log(update)
  const objectId = getObjectId(id)
  const userToUpdate = await User.findById(objectId).exec()
  console.log(userToUpdate)
  merge(userToUpdate,update)
  return userToUpdate.save()
}

export const userResolvers = {
  Query: {
    getMe,
    allUsers
  },

  Mutation: {
    signin,
    signup,
    removeUser,
    updateUser
  },

  User: {
    async roles(user) {
      const populated = await user
        .populate('roles')
        .execPopulate()

      return populated.roles
    }
  }

}
