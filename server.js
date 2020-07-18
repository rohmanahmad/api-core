'use strict'

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
    ignoreTrailingSlash: true, // registers both "/foo" and "/foo/" :: tanpa / dibelakang atau tidak, sama saja
    caseSensitive: true // https://www.fastify.io/docs/latest/Server/#casesensitive
})
const injections = require('./bootstrap') // {use: function}
const route = require('./routes/route')

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
fastify.register(require('fastify-postgres'), {
    connectionString: process.env.POSTGRESQL_DSN
})

/* documentation */
fastify.register(require('fastify-swagger'), {
  routePrefix: '/api/documentation',
  swagger: {
    info: {
      title: 'API Documentation',
      description: 'Documentation for Current API',
      version: '0.1.0'
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    },
    host: 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    tags: [
      { name: 'Home', description: 'All About Home Routes' },
      { name: 'Users', description: 'All About User Routes' },
      { name: 'UKM', description: 'All About UKM Routes' },
      { name: 'Customers', description: 'All About Customers Routes' },
      { name: 'Products', description: 'All About Products Routes' },
      { name: 'Transactions', description: 'All About Transaction Routes' },
      { name: 'Shipping', description: 'All About Shipping Routes' },
      { name: 'Configurations', description: 'All About Configuration Routes' },
      { name: 'Conversations', description: 'All About Conversation Routes' }
    ],
    definitions: {
      User: {
        $id: 'User',
        type: 'object',
        required: ['id', 'email'],
        properties: {
          id: { type: 'string', format: 'uuid' },
          firstName: { type: 'string', nullable: true },
          lastName: { type: 'string', nullable: true },
          email: {type: 'string', format: 'email' }
        }
      }
    },
    securityDefinitions: {
      apiKey: {
        type: 'apiKey',
        name: 'apiKey',
        in: 'header'
      }
    }
  },
  exposeRoute: true
})

/* registering routes */
// register route harus dibawah nya swagger, karena swagger membaca schema yg di dapat dari masing2 routes yg didaftarkan
fastify.register(route(injections))

fastify.ready(function (err) {
    if (err) {
        console.log(err)
        process.env(1)
    }
    fastify.swagger()
    fastify.listen(process.env.APP_PORT)
        .then((address) => console.log(`server listening on ${address}`))
        .catch(err => {
            console.log('Error starting server:', err)
            process.exit(1)
        })
})