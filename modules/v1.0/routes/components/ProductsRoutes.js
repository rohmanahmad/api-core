const prefix = '/product'
const routes = [
    {
        method: 'GET',
        url: '/',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
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
                                        disabled: {type: 'boolean'},
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
                                            product_id: { type: 'number', example: 1 },
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
                                            product_stars: { type: 'object', example: { value: 4.5, label: 'Good Product' }},
                                            // only for logged users
                                            is_favorite: {type: 'boolean', example: true},
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
    },
    {
        method: 'GET',
        url: '/detail',
        // version: '1.0.0', // untuk header. disable dlu. ruwet
        schema: {
            zone: 'client',
            tags: ['Products'],
            summary: 'Product Detail',
            description: 'Detail Information For Product',
            security: [
                {
                  "apiKey": []
                }
            ],
            required: [
                'product_id'
            ],
            // required: ['accept-version'],
            querystring: [
                "product_id"
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
                                        product_id: { type: 'number', example: 2 }
                                    }
                                },
                                item: {
                                    type: 'object',
                                    properties: {
                                        product_id: { type: 'number', example: 1 },
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
                                        product_images: {
                                            type: 'array',
                                            example: [{
                                                index: 1,
                                                image: '/static/images/product1.jpg',
                                                title: 'this is image 1'
                                            }]
                                        },
                                        product_stars: {
                                            type: 'object',
                                            properties: {
                                                value: {type: 'number'},
                                                label: {type: 'string'}
                                            },
                                            example: {
                                                value: 4.5,
                                                label: 'Good Product'
                                            }
                                        },
                                        // only for logged users
                                        is_favorite: {type: 'boolean', example: true},
                                        created_at: { type: 'string', example: '2020/01/01 20:02:02' },
                                        updated_at: { type: 'string', example: '2020/01/01 20:02:02' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        preHandler: [
            // 'Authentication'
        ],
        handler: 'ProductsController.detail'
    }
]

module.exports = {routes, prefix}
