'use strict'

const {use} = require('./bootstrap')

const models = use('models')

function getType (type) {
    if (type === 'text') {
        return 'TEXT'
    }else if (type instanceof String) {

    }
}

const sequenceSql = `CREATE SEQUENCE IF NOT EXISTS {{seqName}};`
const createTableSql = `CREATE TABLE "{{tableName}}" ("id" int4 NOT NULL DEFAULT nextval('{{seqName}}'::regclass),PRIMARY KEY ("id"));`
const createColumnSql = `ALTER TABLE {{tableName}} ADD COLUMN IF NOT EXISTS {{columNameWithType}};`
const createIndexSql = `CREATE INDEX IF NOT EXISTS {{indexName}} ON {{tableName}}( {{column}} );`

for (const modelName in models) {
    const {tableName, schemas, index: indexes} = models[modelName]()
    const seqName = `${tableName}_seq`
    const seqSQL = sequenceSql.replace('{{seqName}}', seqName)
    const tableSQL = createTableSql.replace('{{tableName}}', tableName).replace('{{seqName}}', seqName)
    let columnSQL = ''
    for (const schemaName in schemas) {
        const stringType = schemas[schemaName]['stringType']
        const isNullable = schemas[schemaName]['isNullable'] ? 'NULL' : 'NOT NULL'
        const nameWithType = `${stringType} ${isNullable}`
        columnSQL += `
            ${createColumnSql.replace('{{tableName}}', tableName).replace('{{columNameWithType}}', nameWithType)}
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
                if (xIndex > 2) columns += ',' // karena index pertama itu master, jadi di skip
                columns += field
            }
            xIndex += 1
        }
        indexSQL += `
            ${createIndexSql.replace('{{indexName}}', indexName).replace('{{tableName}}', tableName).replace('{{column}}', tableName)}
        `
    }
    console.log(`
    ${seqSQL}
    ${tableSQL}
    ${columnSQL}
    ${indexSQL}
    `.trim())
}
