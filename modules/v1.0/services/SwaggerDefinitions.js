const {result} = require('lodash')

const definitions = {
    querystring: {
        // C
        category_id: {type: 'number'},
        category_name: {type: 'string'},
        customer_id: {type: 'number'},
        // F
        fullname: {type: 'string'},
        // H
        handler_url: {type: 'string'},
        // I
        is_component: {type: 'string', enum: ['yes', 'no']},
        // L
        limit: {type: 'number'},
        // N
        name: {type: 'string'},
        // O
        otp_code: {type: 'string'},
        otp_method: {type: 'string', example: 'email / whatsapp'},
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
        username: {type: 'string'},
        ukm_id: {type: 'number'}
    },
    body: {
        // A
        avatar: {type: 'string'},
        // E
        email: {type: 'string'},
        // F
        family_name: {type: 'string'},
        full_name: {type: 'string'},
        // G
        given_name: {type: 'string'},
        // O
        otp_method: {type: 'string', example: 'email / whatsapp'},
        // P
        password: {type: 'string'},
        // T
        token: {type: 'string'},
        // U
        userlogin: {type: 'string', example: 'email / phone'},
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