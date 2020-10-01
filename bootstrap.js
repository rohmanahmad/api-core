require('dotenv').config()
const {readFileSync} = require('fs')
const path = require('path')
const fplugin = require('fastify-plugin')
const moment = require('moment-timezone')
const helmet = require('fastify-helmet')
// const fastifyEnv = require('fastify-env')
const formbody = require('fastify-formbody')
const fastify = require('fastify')
const postgres = require('fastify-postgres')
const fastifyRedis = require('fastify-redis')

const controllers = {
    AuthenticationController: require('./modules/v1.0/controllers/AuthenticationController'),
    CallbacksController: require('./modules/v1.0/controllers/CallbacksController'),
    CategoriesController: require('./modules/v1.0/controllers/CategoriesController'),
    HomeController: require('./modules/v1.0/controllers/HomeController'),
    ProductsController: require('./modules/v1.0/controllers/ProductsController'),
    ReviewsController: require('./modules/v1.0/controllers/ReviewsController'),
    UserController: require('./modules/v1.0/controllers/UserController'),
    WebviewController: require('./modules/v1.0/controllers/WebviewController')
}

const models = {
    ActivityLogModel: require('./modules/v1.0/models/components/ActivityLogModel'),
    AddressListModel: require('./modules/v1.0/models/components/AddressListModel'),
    AvailableShipping: require('./modules/v1.0/models/components/AvailableShippingModel'),
    CategoriesModel: require('./modules/v1.0/models/components/CategoriesModel'),
    ConversationListModel: require('./modules/v1.0/models/components/ConversationListModel'),
    CustomerListModel: require('./modules/v1.0/models/components/CustomerListModel'),
    EWalletModel: require('./modules/v1.0/models/components/EWalletModel'),
    OTPCodeModel: require('./modules/v1.0/models/components/OTPCodeModel'),
    PaymentRefsModel: require('./modules/v1.0/models/components/PaymentRefsModel'),
    ProductFavoritesModel: require('./modules/v1.0/models/components/ProductFavoritesModel'),
    ProductImagesModel: require('./modules/v1.0/models/components/ProductImagesModel'),
    ProductsModel: require('./modules/v1.0/models/components/ProductsModel'),
    RateSummaryModel: require('./modules/v1.0/models/components/RateSummaryModel'),
    ReviewRepliesModel: require('./modules/v1.0/models/components/ReviewRepliesModel'),
    ReviewsModel: require('./modules/v1.0/models/components/ReviewsModel'),
    RolesModel: require('./modules/v1.0/models/components/RolesModel'),
    ShippingListModel: require('./modules/v1.0/models/components/ShippingListModel'),
    TransactionDetailModel: require('./modules/v1.0/models/components/TransactionDetailModel'),
    TransactionListModel: require('./modules/v1.0/models/components/TransactionListModel'),
    UKMConfigurationModel: require('./modules/v1.0/models/components/UKMConfigurationModel'),
    UKMListModel: require('./modules/v1.0/models/components/UKMListModel'),
    UserAccountsModel: require('./modules/v1.0/models/components/UserAccountsModel'),
    UserActivityLogModel: require('./modules/v1.0/models/components/UserActivityLogModel'),
    UserTokensModel: require('./modules/v1.0/models/components/UserTokensModel'),
    WalletTransactionModel: require('./modules/v1.0/models/components/WalletTransactionModel'),
}

const routes = {
    AuthenticationRoutes: require('./modules/v1.0/routes/components/AuthenticationRoutes'),
    CallbacksRoutes: require('./modules/v1.0/routes/components/CallbacksRoutes'),
    CategoriesRoutes: require('./modules/v1.0/routes/components/CategoriesRoutes'),
    HomeRoutes: require('./modules/v1.0/routes/components/HomeRoutes'),
    ProductsRoutes: require('./modules/v1.0/routes/components/ProductsRoutes'),
    ReviewsRoutes: require('./modules/v1.0/routes/components/ReviewsRoutes'),
    UserAccountsRoutes: require('./modules/v1.0/routes/components/UserAccountsRoutes'),
    WebviewRoutes: require('./modules/v1.0/routes/components/WebviewRoutes'),
}

const services = {
    AuthenticationService: require('./modules/v1.0/services/AuthenticationService'),
    CategoriesService: require('./modules/v1.0/services/CategoriesService'),
    ProductsService: require('./modules/v1.0/services/ProductsService'),
    RedisService: require('./modules/v1.0/services/RedisService'),
    ReviewsService: require('./modules/v1.0/services/ReviewsService'),
    SessionService: require('./modules/v1.0/services/SessionService'),
    SwaggerDefinitions: require('./modules/v1.0/services/SwaggerDefinitions'),
    TaskService: require('./modules/v1.0/services/TaskService'),
    UserAccountsService: require('./modules/v1.0/services/UserAccountsService'),
    UserTokensService: require('./modules/v1.0/services/UserTokensService'),
}

const helpers = {
    ProductHelper: require('./modules/v1.0/helpers/ProductHelper'),
    GoogleAuthHelper: require('./modules/v1.0/helpers/GoogleAuthHelper')
}

const middlewares = {
    Authentication: require('./modules/v1.0/middlewares/AuthenticationMiddleware')
}

const configurations = {
    SwaggerForClient: require('./modules/v1.0/configurations/swagger/Client'),
    SwaggerForAdmin: require('./modules/v1.0/configurations/swagger/Admin'),
    SwaggerForPartners: require('./modules/v1.0/configurations/swagger/Partners')
}

const statics = {
    GoogleLogin: readFileSync(path.join(__dirname, 'modules/v1.0/statics/GoogleLogin.html'), {encoding: 'utf-8'})
}

const environments = process.env

const m = {models, controllers, routes, services, middlewares, helpers, configurations, statics, environments}
const use = function (mode, name) {
    /* 
    example:
        -   fastify.use('models', 'UserModel')
    */
    
   try {
       const x = m[mode]
       if (!x) throw new Error(`Ops, Kamu Lupa daftarin ${mode} di file ./bootstrap.js`)
       if (name) {
           if (!x[name]) throw new Error(`Ops, Kamu Lupa daftarin ${mode}/${name} di file ./bootstrap.js`)
           return x[name]
       }
       return x
   } catch (err) {
       console.error(err)
       process.exit(0)
   }
}
const plugin = fplugin(function (instance, opts, next) {
    instance.decorate('include', use)
    next()
})

const server = function () {
    const instance = fastify({
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

    /* read the env file :  */
    // instance.register(fastifyEnv, {
    //     dotenv: {
    //         path: `${__dirname}/.env`,
    //         debug: true
    //     },
    //     schema: {
    //         type: 'object',
    //         required: [ 'APP_PORT' ],
    //         properties: {
    //         PORT: {
    //             type: 'string',
    //             default: 3000
    //         }
    //         }
    //     }
    // })

    // register form parser (application/x-www-form-urlencoded)
    instance.register(formbody)

    const route = require('./modules/v1.0/routes')

    // fastify.register(plugin)
    instance.decorate('include', use)

    // monitoring request url
    instance.addHook('onRequest', (req, reply, done) => {
        console.info(`[${req.method}]`, req.url)
        done()
    })

    // redis driver: https://github.com/fastify/fastify-redis
    instance
        .register(fastifyRedis, {
            url: process.env.REDIS_URI
        })

    // register jwt https://github.com/fastify/fastify-jwt
    instance.register(require('fastify-jwt'), {
        secret: process.env.APP_KEY
    })

    /* Helmet : https://github.com/fastify/fastify-helmet */
    instance.register(helmet, {
        hidePoweredBy: { setTo: 'XHTML-5.10' }
    })

    /* db postgresql : https://github.com/fastify/fastify-postgres */
    instance.register(postgres, function () {
        return {
            connectionString: process.env.POSTGRESQL_DSN
        }
    })

    /* documentation : https://github.com/fastify/fastify-swagger*/
    instance.register(require('./customize/fastify-swagger'), use('configurations', 'SwaggerForClient'))
    instance.register(require('./customize/fastify-swagger'), use('configurations', 'SwaggerForPartners')) // using custom 
    instance.register(require('./customize/fastify-swagger'), use('configurations', 'SwaggerForAdmin')) // using custom 

    /* registering routes */
    // register route harus dibawah nya swagger, karena swagger membaca schema yg di dapat dari masing2 routes yg didaftarkan
    instance.register(route(instance, 'SwaggerForClient'))
    instance.register(route(instance, 'SwaggerForPartners'))
    instance.register(route(instance, 'SwaggerForAdmin'))

    /* set notfound response handler */
    instance.setNotFoundHandler({}, function (request, response) {
        response.send({
            message: `(${request.url}) Route not found`,
            error: 'You need add custom headers like accept-version and another header',
            statusCode: 404,
            // errors: err // gak ada
        })
    })

    /* set error response handler */
    instance.setErrorHandler(function (err, request, response) {
        console.error(err)
        response
            .status(500)
            .send({
                statusCode: 500,
                message: err.message,
                processId: request.id,
                errors: err.stack.toString()
            })
    })

    console.logger = function (...args) {
        console.log(`[${moment().tz('Asia/Jakarta').format('LLL')}]`, ...args)
    }
    /* trying to open port */
    instance.ready(function (err) {
        try {
            if (err) {
                console.error(err)
                process.exit(0)
            }
            instance.swaggerforclient({zoneType: 'client', host: process.env.APP_DOMAIN})
            instance.swaggerforpartners({zoneType: 'partners', host: process.env.APP_DOMAIN})
            instance.swaggerforadmin({zoneType: 'admin', host: process.env.APP_DOMAIN})
            instance.listen(process.env.APP_PORT, process.env.APP_HOST)
            .then(async (address) => {
                const ActivityService = instance.include('services', 'TaskService')(instance)
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
}

module.exports = {
    use,
    plugin,
    server
}
