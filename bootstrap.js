const {readFileSync} = require('fs')
const path = require('path')

const controllers = {
    AuthenticationController: require('./modules/v1.0/controllers/AuthenticationController'),
    CategoriesController: require('./modules/v1.0/controllers/CategoriesController'),
    UserController: require('./modules/v1.0/controllers/UserController'),
    ProductsController: require('./modules/v1.0/controllers/ProductsController'),
    ReviewsController: require('./modules/v1.0/controllers/ReviewsController'),
    HomeController: require('./modules/v1.0/controllers/HomeController'),
    WebviewController: require('./modules/v1.0/controllers/WebviewController')
}

const models = {
    UKMUsersModel: require('./modules/v1.0/models/components/UKMUsersModel'),
    CategoriesModel: require('./modules/v1.0/models/components/CategoriesModel'),
    ProductsModel: require('./modules/v1.0/models/components/ProductsModel'),
    ProductImagesModel: require('./modules/v1.0/models/components/ProductImagesModel'),
    ProductRateSummaryModel: require('./modules/v1.0/models/components/ProductRateSummaryModel'),
    ReviewsModel: require('./modules/v1.0/models/components/ReviewsModel'),
    ActivityLogModel: require('./modules/v1.0/models/components/ActivityLogModel')
}

const routes = {
    AuthenticationRoutes: require('./modules/v1.0/routes/components/AuthenticationRoutes'),
    UserRoutes: require('./modules/v1.0/routes/components/UserRoutes'),
    CategoriesRoutes: require('./modules/v1.0/routes/components/CategoriesRoutes'),
    ProductsRoutes: require('./modules/v1.0/routes/components/ProductsRoutes'),
    ReviewsRoutes: require('./modules/v1.0/routes/components/ReviewsRoutes'),
    HomeRoutes: require('./modules/v1.0/routes/components/HomeRoutes'),
    WebviewRoutes: require('./modules/v1.0/routes/components/WebviewRoutes')
}

const services = {
    AuthenticationService: require('./modules/v1.0/services/AuthenticationService'),
    CategoriesService: require('./modules/v1.0/services/CategoriesService'),
    SwaggerDefinitions: require('./modules/v1.0/services/SwaggerDefinitions'),
    ProductsService: require('./modules/v1.0/services/ProductsService'),
    ReviewsService: require('./modules/v1.0/services/ReviewsService'),
    TaskService: require('./modules/v1.0/services/TaskService'),
}

const helpers = {
    ProductHelper: require('./modules/v1.0/helpers/ProductHelper')
}

const middlewares = {
    Authentication: require('./modules/v1.0/middlewares/AuthenticationMiddleware')
}

const configurations = {
    SwaggerForClient: require('./modules/v1.0/configurations/swagger/Client'),
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

const plugin = require('fastify-plugin')
exports.use = use
exports.plugin = plugin(function (instance, opts, next) {
    instance.decorate('include', use)
    next()
})
