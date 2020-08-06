const prefix = '/v1/users'
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            tags: ['User Account'],
            summary: 'User Information',
            description: 'getting information about specific user',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [
                'name',
                'fullname'
            ],
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
        handler: 'UserController.me'
    }
]

module.exports = {routes, prefix}
