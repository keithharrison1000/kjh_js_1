import { User } from './user.model'
import merge from 'lodash.merge'
import { verifyUserGraphQL, createUserGraphQL } from '../../modules/auth';

const getMe = (_, __, ctx) => {
  console.log(ctx.req.authorized)
  return ctx.user
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


export const userResolvers = {
  Query: {
    getMe
  },
  Mutation: {
    signin,
    signup
  }

}
