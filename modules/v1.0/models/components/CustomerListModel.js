'use strict'

const Models = require('../index')
const {result} = require('lodash')

class CustomerListModel extends Models {
    constructor(instance) {
        super()
        this.instance = instance
    }

    get tableName () {
        return 'customer_list'
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
            customer_title: {
                type: String,
                stringType: 'bpchar(50)',
                isNullable: false
            }, // tuan, nyonya, agan, sista
            customer_fullname: {
                type: String,
                stringType: 'bpchar(40)',
                isNullable: false
            },
            is_verified: {
                type: Boolean,
                stringType: 'bool',
                isNullable: false
            }, // verifikasi dilakukan untuk menentukan apakah real atau enggak
            verification_photo: {
                type: String,
                stringType: 'int4',
                isNullable: false
            }, // foto bersama ktp untuk prosess verifikasi
            identity_no: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            }, // nomor ktp
            birth_date: {
                type: Date,
                stringType: 'int4',
                isNullable: false
            }, // tanggal tanpa jam
            birth_place: {
                type: String,
                stringType: 'bpchar(30)',
                isNullable: false
            }, // kota tempat lahir
            main_address_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke address_list.id
            secondary_address_id: {
                type: Number,
                stringType: 'int4',
                isNullable: false
            }, // relasi ke address_list.id
            is_indonesia: {
                type: Boolean,
                stringType: 'int4',
                isNullable: false
            }, // ktp indonesia atau bukan
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
            identity: { // untuk mencari data berdasarkan no ktp/sim/passport
                keys: {identity_no: 1},
                uniq: true
            },
            is_verified: { // untuk mencari data yg terverifikasi dan blm
                keys: {is_verified: -1},
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
    const model = new CustomerListModel(instance)
    return model
}