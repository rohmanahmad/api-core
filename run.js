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

(async function () {
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
})()
