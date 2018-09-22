import express from 'express'
import setupMiddware from './middleware'
import { connect } from './db'
import { restRouter, graphQLServer } from './api'
import { graphiqlExpress } from 'apollo-server-express'
import { altairExpress } from 'altair-express-middleware'
import { signin, verifyUser, createUser, protect, protectGraphQL } from './api/modules/auth'
import { apiErrorHandler } from './api/modules/errorHandler'

const app = express();
setupMiddware(app);
connect();

app.use('/signup', createUser)
app.use('/signin', verifyUser,signin)
app.use('/api', protect, restRouter)
app.use('/graphql', protectGraphQL)
graphQLServer.applyMiddleware({app})
//app.use('/docs', graphiqlExpress({ endpointURL: '/graphql' }))
app.use('/gqldocs', altairExpress({ endpointURL: '/graphql', 
subscriptionsEndpoint: 'ws://localhost:4000/subscriptions'
}))
// catch all
app.all('*', (req, res) => {
  res.json({ok: true})
})

app.use(apiErrorHandler)
export default app
