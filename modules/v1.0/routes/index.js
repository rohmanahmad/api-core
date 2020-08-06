'use strict'
const {join} = require('path')
const {result, set, isArray} = require('lodash')

module.exports = function (instance) {
    return (context, opts, done) => {
        const routesObj = instance.include('routes')
        const definition = instance.include('services', 'SwaggerDefinitions')
        for (const routerFile in routesObj) {
            const {routes, prefix} = routesObj[routerFile]
            for (let routeName in routes) {
                const route = routes[routeName]
                const controllerName = route.handler.split('.')[0]
                const handler = route.handler.split('.')[1]
                const controller = instance.include('controllers', controllerName)
                if (!controller) throw new Error(`Ups Kamu Lupa Daftarin controller (${controllerName}.js) di bootstrap.js`)
                if (typeof controller(handler) !== 'function') throw new Error(`Kamu Lupa Buat Function (${handler}) di controller (${controllerName})`)
                route['handler'] = controller(handler) // promise
                route['url'] = join(prefix, route['url'])
                /* swagger purpose */
                const querySchema = result(route, 'schema.querystring')
                const paramSchema = result(route, 'schema.params')
                const bodySchema = result(route, 'schema.body')
                if (querySchema) {
                    if (!isArray(querySchema)) throw new Error(`(${routerFile}) [${route['url']}] QueryString Harus Berupa Array!`)
                    const queryTransformation = querySchema.reduce((r, x) => {
                        return {r, ...definition(`querystring.${x}`)}
                    }, {})
                    set(route, 'schema.querystring', queryTransformation)
                }
                if (paramSchema) {
                    if (!isArray(paramSchema)) throw new Error(`(${routerFile}) [${route['url']}] Parameters Harus Berupa Array!`)
                    const paramTransformation = paramSchema.reduce((r, x) => {
                        return {r, ...definition(`params.${x}`)}
                    }, {})
                    set(route, 'schema.params', paramTransformation)
                }
                if (bodySchema) {
                    if (!isArray(bodySchema)) throw new Error(`(${routerFile}) [${route['url']}] Body Harus Berupa Array!`)
                    const bodyTransformation = bodySchema.reduce((r, x) => {
                        return {...r, ...definition(`body.${x}`)}
                    }, {})
                    set(route, 'schema.body', bodyTransformation)
                }
                /* http middleware */
                const pHandler = route['preHandler']
                if (pHandler) {
                    if (pHandler[0]) {
                        for (const middleIndex in pHandler) {
                            const MiddleName = instance.include('middlewares', pHandler[middleIndex])
                            const m = new MiddleName().handle
                            pHandler[middleIndex] = m
                        }
                    }
                }
                /* end of swagger */
                context.route(route, {prefix})
                console.log(`[DEBUG] registrasi route: [${route.method}] ${route['url']}`)
            }
        }
        done()
    }
}