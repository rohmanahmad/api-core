const prefix = '/auth'
const routes = [
    {
        method: 'POST',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'partners',
            tags: ['Authentication'],
            summary: 'Login User UKM',
            description: 'login and authentication for UKM user',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [],
            body: [
                'username',
                'password'
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
        ],
        handler: 'AuthenticationController.loginUKMUser'
    },
]

module.exports = {routes, prefix}
