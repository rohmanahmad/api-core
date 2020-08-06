'use strict'

class TaskService {
    constructor (instance) {
        this.instance = instance
    }

    async createRestartActivity () {
        try {
            const ActivityLog = this.instance.include('models', 'ActivityLogModel')(this.instance)
            await ActivityLog.createRestartActivity()
            console.log('creating restart activity')
            return true
        } catch (err) {
            throw err
        }
    }
}

module.exports = function (injection = {}) {
    const instance = new TaskService(injection)
    return instance
}