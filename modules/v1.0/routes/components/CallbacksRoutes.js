const prefix = '/'
const routes = [
    {
        method: 'POST',
        url: '/callbacks/google/signin',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
            tags: ['Callbacks API'],
            summary: 'Callback For Google Auth',
            description: 'category list',
            security: [
                {
                  "apiKey": []
                }
            ],
            body: [
                "full_name",
                "given_name",
                "family_name",
                "avatar",
                "email",
                "token",
            ],
            response: {
                // 200: {
                //     type: 'object',
                //     properties: {
                //         statusCode: { type: 'number', example: '200' },
                //         message: { type: 'string' },
                //         data: {
                //             type: 'object',
                //             properties: {
                //                 token: {type: 'string', example: 'md5hash'},
                //                 user: {
                //                     type: 'object',
                //                     example: {
                //                         id: 1,
                //                         name: 'blabla',
                //                         email: 'blabla@bla.com',
                //                         partner_data: {
                //                             status: true,
                //                             data: {
                //                                 ukm_id: 3,
                //                                 ukm_name: 'Serba Ada',
                //                             }
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
            }
        },
        preHandler: [
        ],
        handler: 'CallbacksController.googleSignin'
    },
    {
        method: 'POST',
        url: '/callbacks/google/signin',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'partners',
            tags: ['Callbacks API'],
            summary: 'Callback For Google Auth',
            description: 'category list',
            security: [
                {
                  "apiKey": []
                }
            ],
            body: [
                "full_name",
                "given_name",
                "family_name",
                "avatar",
                "email",
                "token",
            ],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        statusCode: { type: 'number', example: '200' },
                        message: { type: 'string' },
                        data: {
                            type: 'object',
                            properties: {
                                token: {type: 'string', example: 'md5hash'},
                                user: {
                                    type: 'object',
                                    example: {
                                        id: 1,
                                        name: 'blabla',
                                        email: 'blabla@bla.com',
                                        partner_data: {
                                            status: true,
                                            data: {
                                                ukm_id: 3,
                                                ukm_name: 'Serba Ada',
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        preHandler: [
        ],
        handler: 'CallbacksController.googleSignin'
    }
]

module.exports = {routes, prefix}
