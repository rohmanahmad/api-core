'use strict'

const Models = require('../index')
const {result} = require('lodash')

class ConversationListModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'conversation_list'
    }

    get connection () {
        return 'pg'
    }

    get schemas () {
        return {
            id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            conversation_date: {
                type: Date,
                stringType: 'date',
                isNullable: false
            },
            conversation_content: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            conversation_attachment: {
                type: String,
                stringType: 'text',
                isNullable: false
            },
            customer_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            ukm_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            },
            created_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            },
            updated_at: {
                type: Date,
                stringType: 'timestamp',
                isNullable: false
            }
        }
    }

    get index () {
        return {
            primary: {
                keys: {id: -1},
                uniq: true
            },
            sorting_by_date: { // sort chat by date
                keys: {conversation_date: -1},
                uniq: false
            },
            chats: { // get chats conversation
                keys: {customer_id: 1, ukm_id: 1},
                uniq: false
            },
            date: { // untuk sorting
                keys: {created_at: -1},
                uniq: false
            }
        }
    }

    /* functions */

    /* //blm dipakai
    async getTotal ({category_id, category_name}) {
        try {
            const sql = [`SELECT COUNT(*) FROM ${this.tableName}`]
            const query = await this.execquery(
                sql, this.values)
            return {
                total: parseInt(result(query, 'rows[0].count', 0)),
                filters: {
                    category_id,
                    category_name
                }
            }
        } catch (err) {
            throw err
        }
    } */
}

module.exports = function (instance = {}) {
    const model = new ConversationListModel(instance)
    return model
}