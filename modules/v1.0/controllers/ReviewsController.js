'use strict'

/* CLIENT ZONE */

exports.getReviewByProduct = async function (request, response) {
    const srv = this.include('services', 'ReviewsService')(this)
    const {items, count, filters, pagination} = await srv.getByProduct(request.query)
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

/* ADMIN ZONE */


