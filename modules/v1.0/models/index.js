'use strict'

class Models {
    constructor () {
        this.whereClauses = []
        this.values = []
    }

    async connect () {
        const driver = this.connection
        const connection = await this.instance[driver].connect()
        return connection
    }

    where (key, value = '') {
        const l = this.whereClauses.length
        let sql = ''
        if (l === 0) sql += 'WHERE '
        if (l >= 1) sql += 'AND '
        sql += `${key} = $${l + 1}`
        this.whereClauses.push(sql)
        this.values.push(value)
        return sql
    }

    whereLike (key, value = '') {
        const l = this.whereClauses.length
        let sql = ''
        if (l === 0) sql += 'WHERE '
        if (l >= 1) sql += 'AND '
        sql += `${key} LIKE $${l + 1}`
        this.whereClauses.push(sql)
        this.values.push(value)
        return sql
    }

    limit (limit = 10) {
        const index = this.values.length
        let sql = ''
        sql += `LIMIT $${index + 1}`
        this.values.push(limit)
        return sql
    }

    offset (limit = 10) {
        const index = this.values.length
        let sql = `OFFSET $${index + 1}`
        this.values.push(limit)
        return sql
    }

    async execquery (sql = '', data = []) {
        try {
            const client = await this.connect()
            if (typeof sql !== 'string') sql = sql.join(' ')
            console.log(`running query: `, sql)
            const q = await client.query(sql, data)
            client.release()
            return q
        } catch (err) {
            console.error(err)
            return null
        }
    }
}

module.exports = Models
