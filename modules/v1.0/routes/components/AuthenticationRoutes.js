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
                'userlogin',
                'otp_method'
            ],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'number', example: 200},
                        message: {type: 'string', example: 'ok'},
                        data: {type: 'object', properties: {
                            messageText: { type: 'string' },
                            status: { type: 'string' },
                            otp_dev: { type: 'string' }
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
            querystring: ['username', 'otp_code', 'otp_method'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: {type: 'number'},
                        message: {type: 'string'},
                        data: {type: 'object', properties: {
                            type: { type: 'string' },
                            need_update_profile: { type: 'boolean' },
                            go_to: { type: 'string', example: '/dashboard > available if need_update_profile = false' },
                            token: { type: 'string', example: 'hash with >30 char'},
                            valid_until: { type: 'string', example: '2020-02-01 23:00:21'}
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
