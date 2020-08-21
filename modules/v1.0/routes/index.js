'use strict'
const {join} = require('path')
const {result, set, isArray, cloneDeep} = require('lodash')

function callRoute ({instance, swaggerConfig, routeObject, zones, prefix, definition}){
    if (zones.indexOf(swaggerConfig.zone) > -1) {
        if (typeof routeObject.handler === 'string') {
            const controllerName = routeObject.handler.split('.')[0]
            const handler = routeObject.handler.split('.')[1]
            const controller = instance.include('controllers', controllerName)
            if (!controller) throw new Error(`Ups Kamu Lupa Daftarin controller (${controllerName}.js) di bootstrap.js`)
            if (typeof controller[handler] !== 'function') throw new Error(`Kamu Lupa Buat Function (${handler}) di controller (${controllerName})`)
            routeObject['handler'] = controller[handler].bind(instance) // promise
        } else {
            routeObject['handler'] = routeObject.handler.bind(instance) // promise
        }
        routeObject['url'] = join(swaggerConfig.swagger.basePath, prefix, routeObject['url'])
        // if (routeObject.url.indexOf('/callbacks/') > -1) console.log('-====', swaggerConfig.swagger.basePath, prefix, routeObject['url'])
        const requiredFields = routeObject['schema']['required'] || []
        /* swagger purpose */
        const querySchema = result(routeObject, 'schema.querystring')
        const paramSchema = result(routeObject, 'schema.params')
        const bodySchema = result(routeObject, 'schema.body')
        if (querySchema) {
            if (querySchema.type) {
                set(routeObject, 'schema.querystring', querySchema)
            } else {
                let queryObject = {
                    type: 'object',
                    properties: {}
                }
                if (!isArray(querySchema)) throw new Error(`(${routerFile}) [${routeObject['url']}] QueryString Harus Berupa Array!`)
                queryObject['properties'] = querySchema.reduce((r, x) => {
                    return {...r, ...definition(`querystring.${x}`)}
                }, {})
                const required = querySchema.filter(x => requiredFields.indexOf(x) > -1)
                if (required.length > 0) queryObject['required'] = required
                set(routeObject, 'schema.querystring', queryObject)
            }
        }
        if (paramSchema) {
            if (paramSchema.type) {
                set(routeObject, 'schema.params', paramSchema)
            } else {
                let paramObject = {
                    type: 'object',
                    properties: {}
                }
                if (!isArray(paramSchema)) throw new Error(`(${routerFile}) [${routeObject['url']}] Parameters Harus Berupa Array!`)
                paramObject['properties'] = paramSchema.reduce((r, x) => {
                    return {...r, ...definition(`params.${x}`)}
                }, {})
                const required = paramSchema.filter(x => requiredFields.indexOf(x) > -1)
                if (required.length > 0) paramObject['required'] = required
                set(routeObject, 'schema.params', paramObject)
            }
        }
        if (bodySchema) {
            if (bodySchema.type) {
                set(routeObject, 'schema.body', bodySchema)
            } else {
                let bodyObject = {
                    type: 'object',
                    properties: {}
                }
                if (!isArray(bodySchema)) throw new Error(`(${routerFile}) [${routeObject['url']}] Body Harus Berupa Array!`)
                bodyObject['properties'] = bodySchema.reduce((r, x) => {
                    return {...r, ...definition(`body.${x}`)}
                }, {})
                const required = bodySchema.filter(x => requiredFields.indexOf(x) > -1)
                if (required.length > 0) bodyObject['required'] = required
                set(routeObject, 'schema.body', bodyObject)
            }
        }
        /* http middleware */
        const pHandler = routeObject['preHandler']
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
        console.log(`[DEBUG] registrasi route: [${routeObject.method}] ${routeObject['url']}`)
        return routeObject
    }
}

module.exports = function (instance, zone) {
    return (context, opts, done) => {
        const swaggerConfig = instance.include('configurations', zone)
        const routesObj = instance.include('routes')
        const definition = instance.include('services', 'SwaggerDefinitions')
        for (const routerFile in routesObj) {
            const {routes, prefix} = routesObj[routerFile]
            for (let routeName in routes) {
                const route = cloneDeep(routes[routeName])
                if (!route.schema.zone) throw new Error('zone not defined in route.schema')
                const zones = !route.schema.zone || typeof route.schema.zone === 'string' ? [route.schema.zone] : route.schema.zone
                const routeObj = callRoute({instance, swaggerConfig, routeObject: route, zones, prefix, definition})
                if (routeObj) context.route(routeObj, {prefix})
            }
        }
        done()
    }
}