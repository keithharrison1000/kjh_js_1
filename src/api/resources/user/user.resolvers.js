import { User, getObjectId } from './user.model'
import merge from 'lodash.merge'
import { verifyUserGraphQL, createUserGraphQL } from '../../modules/auth';

const getMe = (_, __, ctx) => {
  //console.log(ctx.req.authorized)
  return ctx.user.toObject()
}

const changePassword = async (_, {input}, ctx) => {
  const {password,newpassword,confirmpassword} = input
  console.log(newpassword)
const user = ctx.user
const isAuthenticated = await user.authenticate(password)

if (!isAuthenticated) {
  throw new Error('Wrong credentials')
  return
}
  
if (newpassword !== confirmpassword) {
  throw new Error('Password confirmation does not match password')
  return
}
user.password =newpassword
user.save()
return user.toObject()
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
  return User.findByIdAndUpdate(id, update, {new: true}).exec()
  //update.roles = update.roles.map(x => getObjectId(x))
  //console.log()
  //console.log(update.roles)
  //const objectId = getObjectId(id)
  //let userToUpdate = await User.findById(objectId).exec()
  //console.log(userToUpdate)
  //merge(userToUpdate,update)
  //console.log(userToUpdate)
  //userToUpdate.roles = update.roles.map(x => getObjectId(x))
  //console.log(userToUpdate.roles)
  //const savedUser = await userToUpdate.save()
  //console.log(savedUser)
  //return savedUser
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
    updateUser,
    changePassword
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
