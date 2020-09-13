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
            querystring: [
                "is_component",
                "handler_url"
            ],
            // body: [],
            response: {
            }
        },
        preHandler: [
        ],
        handler: 'WebviewController.loginCustomerWithGoogle',
        response: {
            200: {
                type: 'html'
            }
        }
    },
]

module.exports = {routes, prefix}
