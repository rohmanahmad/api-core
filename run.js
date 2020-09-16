'use strict'

const {use} = require('./bootstrap')

const models = use('models')
const dotenv = require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    connectionString: process.env.POSTGRESQL_DSN
})

function getType (type) {
    if (type === 'text') {
        return 'TEXT'
    }else if (type instanceof String) {

    }
}

class DummyData {
    constructor (config = {}) {
        this.config = config
    }

    async start () {
        // 
    }
}

class Migration {
    async schemas () {
        const client = await pool.connect()
        const sequenceSql = `CREATE SEQUENCE IF NOT EXISTS {{seqName}};`
        const createTableSql = `CREATE TABLE IF NOT EXISTS "{{tableName}}" ("id" int4 NOT NULL DEFAULT nextval('{{seqName}}'::regclass),PRIMARY KEY ("id"));`
        const createColumnSql = `ALTER TABLE {{tableName}} ADD COLUMN IF NOT EXISTS {{columName}} {{type}} {{isNull}};`
        const createIndexSql = `CREATE INDEX IF NOT EXISTS {{indexName}} ON {{tableName}}( {{column}} );`
        for (const modelName in models) {
            const {tableName, schemas, index: indexes} = models[modelName]()
            console.log(`creating table ${tableName}`)
            const seqName = `${tableName}_seq`
            const seqSQL = sequenceSql.replace('{{seqName}}', seqName)
            const tableSQL = createTableSql.replace('{{tableName}}', tableName).replace('{{seqName}}', seqName)
            let columnSQL = ''
            for (const schemaName in schemas) {
                const stringType = schemas[schemaName]['stringType']
                const isNullable = schemas[schemaName]['isNullable'] ? 'NULL' : 'NOT NULL'
                const nameWithType = `${stringType} ${isNullable}`
                const sql = createColumnSql
                    .replace('{{tableName}}', tableName)
                    .replace('{{columName}}', schemaName)
                    .replace('{{type}}', stringType)
                    .replace('{{isNull}}', isNullable)
                columnSQL += `
                    ${sql}
                `
            }
            let indexSQL = ''
            for (const suffix in indexes) {
                const indexName = `${tableName}_${suffix}`
                const keys = indexes[suffix]['keys']
                let columns = ''
                let xIndex = 0
                for (const field in keys) {
                    if (field !== 'primary') {
                        if (xIndex >= 1) columns += ',' // karena index pertama itu master, jadi di skip
                        columns += field
                    }
                    xIndex += 1
                }
                indexSQL += `
                    ${createIndexSql.replace('{{indexName}}', indexName).replace('{{tableName}}', tableName).replace('{{column}}', columns)}
                `
            }
            try {
                console.log(seqSQL)
                await client.query(seqSQL)
                console.log(tableSQL)
                await client.query(tableSQL)
                console.log(columnSQL)
                await client.query(columnSQL)
                console.log(indexSQL)
                await client.query(indexSQL)
                console.log('done....')
            } catch (err) {
                console.log(err)
                debugger
            }
            // debugger
            // return null
        }
    }

    async importData ({ tables }) {

    }
}

class Run {
    async handle (options) {
        const length = options.length
        let argv = {}
        let key = null
        for (let i = 2; i < length; i++) {
            const c = options[i]
            const o = c.split('=')
            key = o[0].replace('--', '')
            argv[key] = o[1]
        }
        if (!argv.type || typeof (this[argv.type]) !== 'function') throw new Error('Invalid Command')
        await this[argv.type](argv)
    }

    async schema (options = {}) {
        const migrate = new Migration()
        await migrate.schemas()
    }

    // digunakan untuk import data dari hasil export src db
    async data ({tables, limit}) {
        limit = parseInt(limit || 10)
        tables = (tables || '').split(',').map(x => x.trim()).filter(x => x.length > 1)
        // if (tables.length )
        // id tidak perlu di ikutkan krn auto increment
        const sql = `INSERT INTO product_list
            (
                category_id,
                product_name,
                product_description,
                product_price,
                product_status,
                product_discount,
                product_stock,
                created_at,
                updated_at)
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9)`
        const client = await pool.connect()
        for (let i = 1; i <= limit; i++) {
            try {
                const productName = `product ${i}`
                const description = `description for ${productName}`
                const productPrice = 1000 * i + (i * 20)
                const values = [
                    2,
                    productName,
                    description,
                    productPrice,
                    1,
                    0,
                    1,
                    new Date(),
                    new Date()
                ]
                const query = client.query(sql, values)
                const x = await query
                console.log(x)
                console.log(`creating ${productName}`)
            } catch (err) {
                console.log(err)
            }
        }
    }
}

new Run()
    .handle(process.argv)
    .catch(console.error)
    .then(() => {console.log('done')})