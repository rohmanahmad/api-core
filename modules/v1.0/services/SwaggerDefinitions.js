const {result} = require('lodash')

const definitions = {
    querystring: {
        // C
        category_id: {type: 'string'},
        category_name: {type: 'string'},
        customer_id: {type: 'number'},
        // F
        fullname: {type: 'string'},
        // L
        limit: {type: 'number'},
        // N
        name: {type: 'string'},
        // P
        page: {type: 'number'},
        pagination: {type: 'string', enum: ['yes', 'no']},
        product_id: {type: 'number'},
        product_name: {type: 'string'},
        product_stock: {type: 'number'},
        product_status: {type: 'number'},
        // R
        redirect_uri: {type: 'string'},
        // S
        sort_by: {type: 'string'},
        sort_dir: {type: 'string'},
        state: {type: 'string'},
        // U
        ukm_id: {type: 'number'}
    },
    body: {
        username: {type: 'string'},
        password: {type: 'string'},
        body: {type: 'string'}
    },
    headers: {
        version: {type: 'string', default: '1.0.0'}
    },
    params: {},
    responses: {}
}

module.exports = function (key) {
    if (!key) throw new Error('Empty Key')
    const definition = result(definitions, key)
    if (!definition) throw new Error(`Invalid Key for ${key}`)
    const name = key.split('.').reverse()[0]
    return {[name]: definition}
}