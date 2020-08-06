const {result} = require('lodash')

const definitions = {
    querystring: {
        name: {type: 'string'},
        fullname: {type: 'string'},
    },
    body: {
        username: {type: 'string'},
        password: {type: 'string'},
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