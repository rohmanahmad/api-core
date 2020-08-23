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

    get schema () {
        return {
            id: Number,
            customer_title: String, // tuan, nyonya, agan, sista
            customer_fullname: String,
            is_verified: Boolean, // verifikasi dilakukan untuk menentukan apakah real atau enggak
            verification_photo: String, // foto bersama ktp untuk prosess verifikasi
            identity_no: String, // nomor ktp
            birth_date: Date, // tanggal tanpa jam
            birth_place: String, // kota tempat lahir
            main_address_id: Number, // relasi ke address_list.id
            secondary_address_id: Number, // relasi ke address_list.id
            is_indonesia: Boolean, // ktp indonesia atau bukan
            created_at: Date,
            updated_at: Date
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