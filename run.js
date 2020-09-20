'use strict'

const {use} = require('./bootstrap')

const models = use('models')
const dotenv = require('dotenv').config()
const { Pool } = require('pg')
const redis = require('ioredis')

const pool = new Pool({
    connectionString: process.env.POSTGRESQL_DSN
})

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
        console.log(argv)
        await this[argv.type](argv)
    }

    async schema (options = {}) {
        try {
            const Migration = use('commands', 'Migration')
            const migrate = new Migration({include: use, pool})
            await migrate.handle(options)
        } catch (err) {
            console.error(err)
        }
        process.exit(0)
    }

    // digunakan untuk import data dari hasil export src db
    async data (options = {}) {
        try {
            debugger
            const DummyData = use('commands', 'DummyData')
            const dummy = new DummyData({pool, use})
            await dummy.handle(options)
        } catch (err) {
            console.error(err)
        }
        process.exit(0)
    }

    async whatsapp (opts = {}) {
        const whatsappSender = use('commands', 'WhatsappSender')({include: use, redis})
        await whatsappSender.handle(opts)
    }

    async test (opts = {}) {
        try {
            const TestCommand = use('commands', 'Test')({include: use, redis})
            await TestCommand.handle(opts)
        } catch (err) {
            console.error(err)
        }
        process.exit(0)
    }
}

/**
 * jenis perintah:
    - schema
    - data
 * cara menggunakan:
    - schema
        : node run.js --type=schema
    - data
        : node run.js --type=data [--limit=number --tables=string_separated_by_coma --prefix=string --customerId=number]
        - limit: available on table is products
 */
new Run()
    .handle(process.argv)
    .catch(console.error)
    .then(() => {console.log('done')})