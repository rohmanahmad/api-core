'use strict'

const moment = require('moment-timezone')
const helmet = require('fastify-helmet')
const fastifyEnv = require('fastify-env')
const fastify = require('fastify')({
    logger: {
        level: 'info',
        serializers: {
          user (req) {
            return {
              method: req.method,
              url: req.url,
              headers: req.headers,
              hostname: req.hostname,
              remoteAddress: req.ip,
              remotePort: req.connection.remotePort
            }
          }
        }
    },
    // connectionTimeout: 1000 * 60 * 10,
    ignoreTrailingSlash: true, // registers both "/foo" and "/foo/" :: tanpa / dibelakang atau tidak, sama saja
    caseSensitive: true // https://www.fastify.io/docs/latest/Server/#casesensitive
})
const {plugin, use} = require('./bootstrap') // {use: function}
const route = require('./modules/v1.0/routes')

// fastify.register(plugin)
fastify.decorate('include', use)

// avoid duplicate incloming request with same id
fastify.addHook('preHandler', function (request, reply, done) {
  console.log('::::', request.id)
  done()
})

/* Helmet : https://github.com/fastify/fastify-helmet */
fastify.register(helmet, {
    hidePoweredBy: { setTo: 'XHTML-5.10' }
})

/* read the env file :  */
fastify.register(fastifyEnv, {
    dotenv: {
        path: `${__dirname}/.env`,
        debug: true
    },
    schema: {
        type: 'object',
        required: [ 'APP_PORT' ],
        properties: {
          PORT: {
            type: 'string',
            default: 3000
          }
        }
    }
})

/* db postgresql : https://github.com/fastify/fastify-postgres */
fastify.register(require('fastify-postgres'), function () {
  return {
    connectionString: process.env.POSTGRESQL_DSN
  }
})

/* documentation : https://github.com/fastify/fastify-swagger*/
fastify.register(require('fastify-swagger'), use('configurations', 'Swagger'))

/* registering routes */
// register route harus dibawah nya swagger, karena swagger membaca schema yg di dapat dari masing2 routes yg didaftarkan
fastify.register(route(fastify))

/* set notfound response handler */
fastify.setNotFoundHandler({}, function (request, response) {
  response.send({
    message: `(${request.url}) Route not found`,
    error: 'You need add custom headers like accept-version and another header',
    statusCode: 404
  })
})

/* set error response handler */
fastify.setErrorHandler(function (err, request, response) {
  console.error(err)
  response
    .status(500)
    .send({
      statusCode: 500,
      message: err.message,
      processId: request.id
    })
})

console.logger = function (...args) {
  console.log(`[${moment().tz('Asia/Jakarta').format('LLL')}]`, ...args)
}
/* trying to open port */
fastify.ready(function (err) {
    if (err) {
        console.error(err)
        process.exit(0)
    }
    fastify.swagger()
    fastify.listen(process.env.APP_PORT)
      .then(async (address) => {
        const ActivityService = fastify.include('services', 'TaskService')(fastify)
        ActivityService
          .createRestartActivity()
          .then(function () {
            console.log(`server listening on ${address}`)
          })
      })
      .catch((err) => {
          console.error(err)
          process.exit(0)
      })
})