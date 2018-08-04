import merge from 'lodash.merge'

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'undefined'){process.env.NODE_ENV = 'development'}

console.log(process.env.NODE_ENV)

const env = process.env.NODE_ENV

const later = (d,v) =>
    new Promise(resolve => setTimeout(resolve, d, v));

const wait = async () => {
let str = await later(5000,'KJH')
console.log(str)
}
wait();

((async () => 2+2)().then((v)=>console.log(v)))

const test = async ()=>{
let res = await (async () => 2+2)()
console.log(res + 'KJH')
} 
test()

const baseConfig = {
  k:'keith',
  port: 3000,
  secrets: {},
  db: {
    url: 'mongodb://localhost/jams'
  }
}

let envConfig = {}

switch (env) {
  case 'development':
  case 'dev':
    envConfig = require('./dev').config
    break;
  case 'test':
  case 'testing':
    envConfig = require('./testing').config
    break;
  case 'prod':
  case 'production':
    envConfig = require('./prod').config
  default:
    envConfig = require('./dev').config
}


export default merge(baseConfig, envConfig)
