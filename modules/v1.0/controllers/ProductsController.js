'use strict'

class ProductsController {
    constructor () {}
    async list (request, response) {
        console.log(request.url)
        const srv = this.include('services', 'ProductsService')(this)
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
        const srv = this.include('services', 'ProductsService')(this)
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
    const c = new ProductsController(config)
    console.log('****')
    return c[handler]
}