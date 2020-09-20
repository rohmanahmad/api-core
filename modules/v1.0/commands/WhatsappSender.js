'use strict'

const wab = require('venom-bot')

class WhatsappSender {
    constructor (instance) { // instance ini bukan instance dari fastify
        this.instance = instance
    }

    async handle (options) {
        this.initWhatsapp()
        // while (true) {
        //     const ok = await this.handleTasks()
        //     if (!ok) await this.sleep(30)
        //     await this.sleep(3)
        // }
    }

    initWhatsapp () {
        wab
            .create('bot')
            .then((botclient) => this.listenPriority(botclient))
            .catch((error) => {
                console.log(error)
            })
    }
    /**
    * listenPriority()
    - listening from redis trigger
     */
    async listenPriority (bot) {
        let {redis: Redis} = this.instance
        if (typeof Redis === 'function') Redis = new Redis(process.env.REDIS_URI)
        Redis.subscribe('otp', function (err, count) {
            if (err) return console.error(err)
            console.log(`successfull subscribe OTP`)
        })
        Redis.on("message", (channel, data) => {
            const {to_number, message, target} = JSON.parse(data) || {}
            if (target === 'whatsapp') {
                console.log('new trigger detected with message:', message)
                if (message === 'cek') {
                    console.log('getting group list')
                    bot.getAllGroups().then((g) => {
                        console.log(g)
                        debugger
                    })
                } else {
                    bot.sendText(to_number, message)
                        .then(console.log)
                        .catch(console.error)
                }
            }
        })
        bot.onMessage((d) => {
            console.log(d)
            // bot.sendText(d.chatId, 'chat id')
            //     .then(console.log)
            //     .catch(console.error)
            // bot.sendText(d.id, 'by id')
            //     .then(console.log)
            //     .catch(console.error)
        })
    }
    
    async handleTasks () {}
    async getTasks () {}
}

module.exports = function (instance) {
    return new WhatsappSender(instance)
}