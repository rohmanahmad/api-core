'use strict'

exports.main = async function (request, response) {
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

exports.total = async function (request, response) {
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