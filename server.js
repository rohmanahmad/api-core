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

// register form parser (application/x-www-form-urlencoded)
fastify.register(require('fastify-formbody'))

const {plugin, use} = require('./bootstrap') // {use: function}
const route = require('./modules/v1.0/routes')

// fastify.register(plugin)
fastify.decorate('include', use)

// monitoring request url
fastify.addHook('onRequest', (req, reply, done) => {
  console.info(`[${req.method}]`, req.url)
  done()
})


// registering redis db
fastify
  .register(require('fastify-redis'), {
    host: '127.0.0.1',
    password: '',
    port: 6379,
    namespace: 'redisServer1'
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
fastify.register(require('./customize/fastify-swagger'), use('configurations', 'SwaggerForClient'))
fastify.register(require('./customize/fastify-swagger'), use('configurations', 'SwaggerForPartners')) // using custom 

/* registering routes */
// register route harus dibawah nya swagger, karena swagger membaca schema yg di dapat dari masing2 routes yg didaftarkan
fastify.register(route(fastify, 'SwaggerForClient'))
fastify.register(route(fastify, 'SwaggerForPartners'))

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
  try {
    if (err) {
        console.error(err)
        process.exit(0)
    }
    fastify.swaggerforclient({zoneType: 'client'})
    fastify.swaggerforpartners({zoneType: 'partners'})
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
  } catch (err2) {
    console.error(err2)
  }
})