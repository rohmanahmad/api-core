'use strict'

class Models {
    constructor () {
    }
    async connect () {
        const driver = this.connection
        const connection = await this.instance[driver].connect()
        return connection
    }

    async query (sql = '', data = []) {
        try {
            const client = await this.connect()
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
