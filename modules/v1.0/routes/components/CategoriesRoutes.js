const prefix = '/v1/product/categories'
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            tags: ['Products'],
            summary: 'All Categories',
            description: 'category list',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [
                'category_id',
                'category_name',
                'limit',
                'page',
                'pagination'
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
                                metadata: {
                                    type: 'object',
                                    properties: {
                                        count: { type: 'number', example: 2 },
                                        limit: { type: 'number', example: 10 },
                                        page: { type: 'number', example: 1 }
                                    }
                                },
                                pagination: {
                                    type: 'object',
                                    properties: {
                                        current: {type: 'number'},
                                        items: {type: 'array', example: [{label: '1', link: '/link'}]},
                                        limitPerPage: {type: 'number', example: 10}
                                    }
                                },
                                dataitems: {
                                    type: 'array',
                                    items: {
                                        type: "object",
                                        properties: {
                                            id: { type: 'number', example: 1 },
                                            category_name: { type: 'string', example: 'Makanan' },
                                            category_status: { type: 'string', example: 'active' },
                                            created_at: { type: 'string', example: '2020-01-01 20:02:02' },
                                            updated_at: { type: 'string', example: '2020-01-01 20:02:02' }
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
        handler: 'CategoriesController.main'
    },
    {
        method: 'GET',
        url: '/total',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            tags: ['Products'],
            summary: 'Total Of All Categories',
            description: 'category total',
            security: [
                {
                  "apiKey": []
                }
            ],
            querystring: [
                'category_id',
                'category_name',
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
                                total: {
                                    type: 'number',
                                    example: 30
                                },
                                metadata: {
                                    type: 'object',
                                    properties: {
                                        category_id: {type: 'string'},
                                        category_name: {type: 'string'}
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
        handler: 'CategoriesController.total'
    }
]

module.exports = {routes, prefix}
