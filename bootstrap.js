const controllers = {
    AuthenticationController: require('./modules/v1.0/controllers/AuthenticationController'),
    CategoriesController: require('./modules/v1.0/controllers/CategoriesController'),
    UserController: require('./modules/v1.0/controllers/UserController'),
    ProductsController: require('./modules/v1.0/controllers/ProductsController'),
    HomeController: require('./modules/v1.0/controllers/HomeController')
}

const models = {
    UKMUsersModel: require('./modules/v1.0/models/components/UKMUsersModel'),
    CategoriesModel: require('./modules/v1.0/models/components/CategoriesModel'),
    ProductsModel: require('./modules/v1.0/models/components/ProductsModel'),
    ProductImagesModel: require('./modules/v1.0/models/components/ProductImagesModel'),
    ProductRateSummaryModel: require('./modules/v1.0/models/components/ProductRateSummaryModel'),
    ActivityLogModel: require('./modules/v1.0/models/components/ActivityLogModel')
}

const routes = {
    AuthenticationRoutes: require('./modules/v1.0/routes/components/AuthenticationRoutes'),
    UserRoutes: require('./modules/v1.0/routes/components/UserRoutes'),
    CategoriesRoutes: require('./modules/v1.0/routes/components/CategoriesRoutes'),
    ProductsRoutes: require('./modules/v1.0/routes/components/ProductsRoutes'),
    HomeRoutes: require('./modules/v1.0/routes/components/HomeRoutes')
}

const services = {
    AuthenticationService: require('./modules/v1.0/services/AuthenticationService'),
    CategoriesService: require('./modules/v1.0/services/CategoriesService'),
    SwaggerDefinitions: require('./modules/v1.0/services/SwaggerDefinitions'),
    ProductsService: require('./modules/v1.0/services/ProductsService'),
    TaskService: require('./modules/v1.0/services/TaskService'),
}

const helpers = {
    ProductHelper: require('./modules/v1.0/helpers/ProductHelper')
}

const middlewares = {
    Authentication: require('./modules/v1.0/middlewares/AuthenticationMiddleware')
}

const configurations = {
    Swagger: require('./modules/v1.0/configurations/Swagger')
}

const m = {models, controllers, routes, services, middlewares, helpers, configurations}
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
