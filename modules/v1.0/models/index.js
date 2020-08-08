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

    buildQueryLink (parentLink, queries = {}) {
        let currentLink = parentLink.trim()
        const isFirstQuery = currentLink.indexOf('?') > 1
        for (const queryKey in queries) {
            currentLink += `&${queryKey}=${queries[queryKey]}`
        }
        return currentLink
    }

    getPaginationList (current, last, parentLink = '/', filters = {}) {
        /* source: https://gist.github.com/kottenator/9d936eb3e4e3c3e02598 */
        let delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l

        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i)
            }
        }
        for (let page of range) {
            if (l) {
                if (page - l === 2) {
                    const pageUp = l + 1
                    rangeWithDots.push({
                        label: pageUp,
                        link: this.buildQueryLink(parentLink, {...filters, page: pageUp })
                    })
                } else if (page - l !== 1) {
                    rangeWithDots.push({
                        label: '...',
                        link: null
                    })
                }
            }
            const isCurrent = current === page
            rangeWithDots.push({
                label: page,
                link: isCurrent ? null : this.buildQueryLink(parentLink, {...filters, page }),
                current: isCurrent
            })
            l = page
        }
        return rangeWithDots
    }

    usePaginationModule ({total, current, limitPerPage, parentLink, filters}) {
        let items = []
        const paginationLength = Math.ceil(total / limitPerPage)
        return {
            current,
            limitPerPage,
            items: this.getPaginationList(current, paginationLength, parentLink, filters)
        }
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
