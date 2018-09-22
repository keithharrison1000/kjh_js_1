import { makeExecutableSchema } from 'graphql-tools'
import { userType, userResolvers } from './resources/user'
import { songType, songResolvers } from './resources/song'
import { playlistType, playlistResolvers } from './resources/playlist'
import { roleType, roleResolvers } from './resources/role'

import { directivesGQL, directiveResolvers,schemaDirectives } from './resources/directives'
import merge from 'lodash.merge'
import { ApolloServer } from 'apollo-server-express'

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
    roleType,
    songType,
    playlistType
    
  ],
  resolvers: merge(
    {},
    userResolvers,
    roleResolvers,
    songResolvers,
    playlistResolvers
    
  ),
  schemaDirectives: schemaDirectives
})


export const graphQLServer = new ApolloServer({
  schema,
  context: ({req}) => { return { req, user:req.user }}
  
})

