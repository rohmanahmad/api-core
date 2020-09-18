'use strict'

/* CLIENT ZONE */

exports.list = async function (request, response) {
    const srv = this.include('services', 'ProductsService')(this)
    const data = await srv.list(request.query, request.url)
    const responseData = {
        statusCode: 200,
        message: 'OK',
        data
    }
    response.send(responseData)
}

exports.detail = async function (request, response) {
    const srv = this.include('services', 'ProductsService')(this)
    const {objectItem, filters} = await srv.detail(request.query, request.url)
    response.send({
        statusCode: 200,
        message: 'OK',
        data: {
            metadata: {
                filters
            },
            item: objectItem
        }
    })
    debugger
}

exports.total = async function (request, response) {
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

/* ADMIN ZONE */


