const {join} = require('path')

module.exports = function ({ use }) {
    return function (context, opts, done) {
        const routesObj = use('routes')
        for (const route in routesObj) {
            const {routes, prefix} = routesObj[route]
            for (let route of routes) {
                const controllerName = route.handler.split('.')[0]
                const handler = route.handler.split('.')[1]
                const controller = use('controllers', controllerName)
                if (!controller) throw new Error(`Ups Kamu Lupa Daftarin controller (${controllerName}.js) di bootstrap.js`)
                if (typeof controller(handler) !== 'function') throw new Error(`Kamu Lupa Buat Function (${handler}) di controller (${controllerName})`)
                route['handler'] = controller(handler) // promise
                route['url'] = join(prefix, route['url'])
                context.route(route, {prefix})
            }
        }
        done()
    }
}