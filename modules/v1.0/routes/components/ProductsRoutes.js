const prefix = '/v1/product'
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            tags: ['Products'],
            summary: 'Product List',
            description: 'list all available products',
            security: [
                {
                  "apiKey": []
                }
            ],
            // required: ['accept-version'],
            querystring: [
                "product_id",
                "category_id",
                "product_name",
                "product_stock",
                "product_status",
                "sort_by",
                "sort_dir",
                "limit",
                "page",
                "pagination"
            ],
            headers: {
                // 'accept-version': {type: 'string', default: '1.0.0'}
            },
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
                                            category: {
                                                type: 'object',
                                                properties: {
                                                    id: {type: 'number'},
                                                    name: {type: 'string'}
                                                },
                                                example: {
                                                    id: 1,
                                                    name: 'category 1'
                                                }
                                            },
                                            product_name: { type: 'string', example: 'product 1' },
                                            product_description: { type: 'string', example: 'description for product 1' },
                                            product_status: {
                                                type: 'object',
                                                properties: {
                                                    id: {type: 'number'},
                                                    value: {type: 'string'}
                                                },
                                                example: {
                                                    id: 1,
                                                    name: 'active'
                                                }
                                            },
                                            product_discount: { type: 'number', example: 12 },
                                            product_price: { type: 'number', example: 20000 },
                                            product_stock: { type: 'number', example: 2 },
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
            'Authentication'
        ],
        handler: 'ProductsController.list'
    }
]

module.exports = {routes, prefix}
