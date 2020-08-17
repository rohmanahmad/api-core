const prefix = ''
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
            tags: ['Home'],
            summary: 'Home',
            description: 'check current api version and other information',
            security: [
                {
                  "apiKey": []
                }
            ],
            // required: ['accept-version'],
            querystring: [],
            headers: {
                // 'accept-version': {type: 'string', default: '1.0.0'}
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
        preHandler: [
            'Authentication'
        ],
        handler: 'HomeController.main'
    }
]

module.exports = {routes, prefix}
