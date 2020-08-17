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
                if (typeof controller[handler] !== 'function') throw new Error(`Kamu Lupa Buat Function (${handler}) di controller (${controllerName})`)
                route['handler'] = controller[handler].bind(instance) // promise
                route['url'] = join(prefix, route['url'])
                const requiredFields = route['schema']['required'] || []
                /* swagger purpose */
                const querySchema = result(route, 'schema.querystring')
                const paramSchema = result(route, 'schema.params')
                const bodySchema = result(route, 'schema.body')
                if (querySchema) {
                    let queryObject = {
                        type: 'object',
                        properties: {}
                    }
                    if (!isArray(querySchema)) throw new Error(`(${routerFile}) [${route['url']}] QueryString Harus Berupa Array!`)
                    queryObject['properties'] = querySchema.reduce((r, x) => {
                        return {...r, ...definition(`querystring.${x}`)}
                    }, {})
                    const required = querySchema.filter(x => requiredFields.indexOf(x) > -1)
                    if (required.length > 0) queryObject['required'] = required
                    set(route, 'schema.querystring', queryObject)
                }
                if (paramSchema) {
                    let paramObject = {
                        type: 'object',
                        properties: {}
                    }
                    if (!isArray(paramSchema)) throw new Error(`(${routerFile}) [${route['url']}] Parameters Harus Berupa Array!`)
                    paramObject['properties'] = paramSchema.reduce((r, x) => {
                        return {...r, ...definition(`params.${x}`)}
                    }, {})
                    const required = paramSchema.filter(x => requiredFields.indexOf(x) > -1)
                    if (required.length > 0) paramObject['required'] = required
                    set(route, 'schema.params', paramObject)
                }
                if (bodySchema) {
                    let bodyObject = {
                        type: 'object',
                        properties: {}
                    }
                    if (!isArray(bodySchema)) throw new Error(`(${routerFile}) [${route['url']}] Body Harus Berupa Array!`)
                    bodyObject['properties'] = bodySchema.reduce((r, x) => {
                        return {...r, ...definition(`body.${x}`)}
                    }, {})
                    const required = bodySchema.filter(x => requiredFields.indexOf(x) > -1)
                    if (required.length > 0) bodyObject['required'] = required
                    set(route, 'schema.body', bodyObject)
                }
                /* http middleware */
                const pHandler = route['preHandler']
                if (pHandler) {
                    if (pHandler[0]) {
                        for (const middleIndex in pHandler) {
                            const md = pHandler[middleIndex]
                            const middleware = instance.include('middlewares', md)
                            if (!middleware) throw new Error(`Invalid Middleware Named: ${md}`)
                            pHandler[middleIndex] = middleware.bind(instance)
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