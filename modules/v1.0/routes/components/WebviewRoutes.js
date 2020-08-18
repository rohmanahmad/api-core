const prefix = '/webview'
const routes = [
    {
        method: 'GET',
        url: '/login/google/client',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
            tags: ['Authentication'],
            summary: 'Login Customers',
            description: 'login and authentication for Customers',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [],
            // body: [],
            response: {
            }
        },
        preHandler: [
        ],
        handler: 'WebviewController.loginCustomerWithGoogle'
    },
]

module.exports = {routes, prefix}
