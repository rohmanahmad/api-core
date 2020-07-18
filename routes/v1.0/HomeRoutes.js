const prefix = ''
const routes = [
    {
        method: 'GET',
        url: '/',
        version: '1.0.0', // untuk header
        schema: {
            tags: ['Home'],
            summary: 'Home',
            description: 'check current api version and other information',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: {
                name: { type: 'string' },
                excitement: { type: 'integer' }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        hello: { type: 'string' }
                    }
                }
            }
        },
        preHandler: [],
        handler: 'HomeController.index'
    }
]

module.exports = {routes, prefix}
