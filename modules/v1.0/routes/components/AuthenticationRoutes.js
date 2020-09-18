const prefix = '/auth'
const routes = [
    {
        method: 'POST',
        url: '/login',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: ['client', 'partners'],
            tags: ['Authentication'],
            summary: 'Login / Register(auto) For User Account',
            description: 'Login',
            querystring: [],
            body: [
                'userlogin'
            ],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'number'},
                        message: {type: 'string'},
                        data: {type: 'object', properties: {
                            messageText: { type: 'string' }
                        }}
                    }
                }
            }
        },
        preHandler: [
        ],
        handler: 'AuthenticationController.login'
    },
    {
        method: 'GET',
        url: '/validate/otp',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: ['client', 'partners'],
            tags: ['Authentication'],
            summary: 'OTP Validation',
            description: 'Validation',
            querystring: ['otp_code'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'number'},
                        message: {type: 'string'},
                        data: {type: 'object', properties: {
                            type: { type: 'string' },
                            need_update_profile: { type: 'boolean' }
                        }}
                    }
                }
            }
        },
        preHandler: [
        ],
        handler: 'AuthenticationController.OTPValidation'
    },
]

module.exports = {routes, prefix}
