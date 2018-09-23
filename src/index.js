import https from 'https'
import getDevelopmentCertificate from 'devcert-with-localhost'
import config from "./config"
import app from './server'

console.log(config.k);


getDevelopmentCertificate('my-app', { installCertutil: true }).then((ssl) => {
  console.log(ssl)
  const server = https.createServer(ssl, app);


//const server = http.createServer(app)
let currentApp = app

server.listen(3000, () => {
	console.log('Server listening on port 3000')
})

if (module.hot) {
	module.hot.accept(['./server'], () => {
		server.removeListener('request', currentApp)
		server.on('request', app)
		currentApp = app
	})
}

});
