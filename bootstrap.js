const controllers = {
    UserController: require('./controllers/v1.0/UserController'),
    HomeController: require('./controllers/v1.0/HomeController')
}

const models = {
    UsersModel: require('./models/v1.0/UsersModel')
}

const routes = {
    UserRoutes: require('./routes/v1.0/UserRoutes'),
    HomeRoutes: require('./routes/v1.0/HomeRoutes')
}

const modules = {
    UserService: require('./modules/v1.0/UserService')
}

const m = {models, controllers, routes, modules}
const use = function (mode, name) {
    // use('models', 'UserModel')
    const x = m[mode]
    if (name) return x[name]
    return x
}

exports.use = use
