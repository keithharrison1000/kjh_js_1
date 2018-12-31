import bodyParser from 'body-parser'

const allowCrossDomain = (req, res, next) =>{
  res.header('Access-Control-Allow-Origin', "https://localhost:8080");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

const setGlobalMiddleware = (app) => {
  app.use(bodyParser.urlencoded({extended: true}))
  app.use(bodyParser.json())
  app.use(allowCrossDomain)
}

export default setGlobalMiddleware
