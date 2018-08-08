import { makeExecutableSchema } from 'graphql-tools'
import { userType, userResolvers } from './resources/user'
import { songType, songResolvers } from './resources/song'
import { playlistType, playlistResolvers } from './resources/playlist'
import { directivesGQL, directiveResolvers } from './resources/directives'
import merge from 'lodash.merge'
import { graphqlExpress } from 'apollo-server-express'

const baseSchema = `
  schema {
    query: Query
    mutation: Mutation
  }
`

const schema = makeExecutableSchema({
  typeDefs: [
    baseSchema,
    directivesGQL,
    userType,
    songType,
    playlistType
    
  ],
  resolvers: merge(
    {},
    userResolvers,
    songResolvers,
    playlistResolvers
    
  ),
  directiveResolvers: directiveResolvers
})


export const graphQLRouter = graphqlExpress((req) => ({
  schema,
  context: {
    req,
    user: req.user
  }
}))
