'use strict'

const sleep = function () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, 3000);
    })
}
exports.main = async function (request, response) {
    await sleep()
    response.send('ini index')
}
