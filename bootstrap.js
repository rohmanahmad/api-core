const {readFileSync} = require('fs')
const path = require('path')

const controllers = {
    AuthenticationController: require('./modules/v1.0/controllers/AuthenticationController'),
    CategoriesController: require('./modules/v1.0/controllers/CategoriesController'),
    CallbacksController: require('./modules/v1.0/controllers/CallbacksController'),
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
    ProductsModel: require('./modules/v1.0/models/components/ProductsModel'),
    ProductImagesModel: require('./modules/v1.0/models/components/ProductImagesModel'),
    ReviewsModel: require('./modules/v1.0/models/components/ReviewsModel'),
    ReviewRepliesModel: require('./modules/v1.0/models/components/ReviewRepliesModel'),
    RateSummaryModel: require('./modules/v1.0/models/components/RateSummaryModel'),
    ShippingListModel: require('./modules/v1.0/models/components/ShippingListModel'),
    UserAccountsModel: require('./modules/v1.0/models/components/UserAccountsModel'),
    
    TransactionDetailModel: require('./modules/v1.0/models/components/TransactionDetailModel'),
    TransactionListModel: require('./modules/v1.0/models/components/TransactionListModel'),
    UKMConfigurationModel: require('./modules/v1.0/models/components/UKMConfigurationModel'),
    UKMListModel: require('./modules/v1.0/models/components/UKMListModel'),
}

const routes = {
    AuthenticationRoutes: require('./modules/v1.0/routes/components/AuthenticationRoutes'),
    CategoriesRoutes: require('./modules/v1.0/routes/components/CategoriesRoutes'),
    CallbacksRoutes: require('./modules/v1.0/routes/components/CallbacksRoutes'),
    HomeRoutes: require('./modules/v1.0/routes/components/HomeRoutes'),
    ProductsRoutes: require('./modules/v1.0/routes/components/ProductsRoutes'),
    ReviewsRoutes: require('./modules/v1.0/routes/components/ReviewsRoutes'),
    WebviewRoutes: require('./modules/v1.0/routes/components/WebviewRoutes'),
    UserAccountsRoutes: require('./modules/v1.0/routes/components/UserAccountsRoutes'),
}

const services = {
    AuthenticationService: require('./modules/v1.0/services/AuthenticationService'),
    CategoriesService: require('./modules/v1.0/services/CategoriesService'),
    ProductsService: require('./modules/v1.0/services/ProductsService'),
    ReviewsService: require('./modules/v1.0/services/ReviewsService'),
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
