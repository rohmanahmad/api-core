'use strict'

class CategoriesController {
    constructor () {}
    async main (request, response) {
        const srv = this.include('services', 'CategoriesService')(this)
        const {items, count, filters, pagination} = await srv.list(request.query, request.url)
        response.send({
            statusCode: 200,
            message: 'OK',
            data: {
                metadata: {
                    count: items.length,
                    filters
                },
                pagination,
                dataitems: items
            }
        })
    }

    async total (request, response) {
        const srv = this.include('services', 'CategoriesService')(this)
        const {total, filters} = await srv.getTotal(request.query)
        response.send({
            statusCode: 200,
            message: 'OK',
            data: {
                metadata: {
                    filters
                },
                total
            }
        })
    }
}

module.exports = function (handler, config = {}) {
    const c = new CategoriesController(config)
    return c[handler]
}