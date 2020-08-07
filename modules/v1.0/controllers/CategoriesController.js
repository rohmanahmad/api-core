'use strict'

class CategoriesController {
    constructor () {}
    async main (request, response) {
        const srv = this.include('services', 'CategoriesService')(this)
        const data = await srv.getList(request.queries)
        response.send({
            statusCode: 200,
            message: 'OK',
            data: []
        })
    }
}

module.exports = function (handler, config = {}) {
    const c = new CategoriesController(config)
    return c[handler]
}