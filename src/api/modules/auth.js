import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
const jwtSecret = 'blueRhinoJumps'

const disableAuth = false

export const signin = (req, res, next) => {
  // req.user will be there from the middleware
  // verify user. Then we can just create a token
  // and send it back for the client to consume
  const token = signToken(req.user.id)
  res.json({token: token})
}

export const decodeToken = () => (req, res, next) => {
  if (disableAuth) {
    return next()
  }
  const checkToken = expressJwt({ secret: jwtSecret })
  // make it optional to place token on query string
  // if it is, place it on the headers where it should be
  // so checkToken can see it. See follow the 'Bearer 034930493' format
  // so checkToken can see it and decode it
  if (req.query && req.query.hasOwnProperty('access_token')) {
    req.headers.authorization = 'Bearer ' + req.query.access_token
  }

  // this will call next if token is valid
  // and send error if its not. It will attached
  // the decoded token to req.user
  console.log(req.headers.authorization)
  checkToken(req, res, next)
}

export const decodeTokenGraphQL = () => (req, res, next) => {
  if (disableAuth) {
    return next()
  }
  const checkToken = expressJwt({ secret: jwtSecret,credentialsRequired: false})
  // make it optional to place token on query string
  // if it is, place it on the headers where it should be
  // so checkToken can see it. See follow the 'Bearer 034930493' format
  // so checkToken can see it and decode it
  if (req.query && req.query.hasOwnProperty('access_token')) {
    req.headers.authorization = 'Bearer ' + req.query.access_token
  }
console.log('decodeTokenGqL')
//console.log(res)
  // this will call next if token is valid
  // and send error if its not. It will attached
  // the decoded token to req.user
  //console.log(req.headers.authorization)
  checkToken(req, res, next)
}

export const getFreshUserGraphQL = () => (req, res, next) => {

  if (disableAuth) {
    return next()
  }

  if (!req.user){
    delete req.user
    req.authorized = false
    return next()

  }

  return User.findById(req.user.id).select("+password").populate("roles")
    .then(function(user) {
      if (!user) {
        delete req.user
        req.authorized = false
      } else {
        // update req.user with fresh user from
        // stale token data
        //console.log(user)
        req.authorized = true
        req.user = user
        //res.send(user)
        next()
      }
    })
    .catch(error => next(error))
}


export const getFreshUser = () => (req, res, next) => {

  if (disableAuth) {
    return next()
  }


  return User.findById(req.user.id)
    .then(function(user) {
      if (!user) {
        // if no user is found it was not
        // it was a valid JWT but didn't decode
        // to a real user in our DB. Either the user was deleted
        // since the client got the JWT, or
        // it was a JWT from some other source
        res.status(401).send('Unauthorized')
      } else {
        // update req.user with fresh user from
        // stale token data
        req.user = user
        //res.send(user)
        next()
      }
    })
    .catch(error => next(error))
}


export const createUser = (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  
  User.findOne({username: username})
    .then(function(user) {
      if (user) {
        res.status(401).send('No user already exists')
      } else {
        
        User.create({username: username, password: password})
        .then((user) => {
          const token = signToken(user.id)
          res.json({user:user,token: token}) 
          }
        )
        .catch(err => next(err))
      }
    })
    .catch(err => next(err))
}

export const createUserGraphQL = (input) => {
  const username = input.username
  const password = input.password
  
  return User.findOne({username: username})
    .then(function(user) {
      if (user) {
        throw new Error('User already exists')
      } else {
        
        return User.create({username: username, password: password})
        .then((user) => {
          return {id:user.id,username:user.username,token:signToken(user.id)}
          }
        )
        .catch(err => err)
      }
    })
    .catch(err => err)
}

export const verifyUserGraphQL1 = (input) => {

  const username = input.username
  const password = input.password
  console.log(username)
  

  // if no username or password then send
  if (!username || !password) {
    throw new Error('You need a username and password')
    return
  }

  // look user up in the DB so we can check
  // if the passwords match for the username

  return User.findOne({username: username}).select('id + username + password')
  .then(function(user) {
    if (!user) {
      throw new Error('No user with the given username')
    } else {
      console.log(user)
      // checking the passowords here
      if (!user.authenticate(password)) {
        throw new Error('Wrong password')
      } else {
        console.log(user)
        // if everything is good,
        // then attach to req.user
        // and call next so the controller
        // can sign a token from the req.user._id
        return {id:user.id,username:user.username,token:signToken(user.id)}
        //return {id:1,username:'kjh',token:'123'}
       
      }
    }
  })
  .catch(err => next(err))  
  //return User.findOne({username: username}).then(() => {return {id:'1',username:'kh',token:'1234'} })
  
}

export const verifyUserGraphQL = async (input) => {

  const username = input.username
  const password = input.password
  console.log(username)
  

  // if no username or password then send
  if (!username || !password) {
    throw new Error('You need a username and password')
    return
  }

  // look user up in the DB so we can check
  // if the passwords match for the username

  const user = await User.findOne({username: username}).select('id + username + password')
  
    if (!user) {
      throw new Error('No user with the given username')
      return
    } 

    const pwdTest = await user.authenticate(password)
    
    if (!pwdTest) {
        throw new Error('Wrong password')
        return
    }
        console.log(user)
        // if everything is good,
        // then attach to req.user
        // and call next so the controller
        // can sign a token from the req.user._id
        return {id:user.id,username:user.username,token:signToken(user.id)}
        //return {id:1,username:'kjh',token:'123'}
       
      
  }
  
  



export const verifyUser = (req, res, next) => {

  const username = req.body.username
  const password = req.body.password
  

  // if no username or password then send
  if (!username || !password) {
    res.status(400).send('You need a username and password')
    return
  }

  // look user up in the DB so we can check
  // if the passwords match for the username
  User.findOne({username: username})
    .then(function(user) {
      if (!user) {
        res.status(401).send('No user with the given username')
      } else {
        // checking the passowords here
        if (!user.authenticate(password)) {
          res.status(401).send('Wrong password')
        } else {
          // if everything is good,
          // then attach to req.user
          // and call next so the controller
          // can sign a token from the req.user._id
          req.user = user;
          next()
        }
      }
    })
    .catch(err => next(err))
}

export const signToken = (id) => jwt.sign(
  {id},
  jwtSecret,
  {expiresIn: '30d'}
)

export const protect = [decodeToken(), getFreshUser()]
export const protectGraphQL = [decodeTokenGraphQL(), getFreshUserGraphQL()]
