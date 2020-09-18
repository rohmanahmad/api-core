'use strict'

class ServiceModule {
    getPaginationList (current, last, filters = {}) {
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
                        position: pageUp
                    })
                } else if (page - l !== 1) {
                    rangeWithDots.push({
                        position: '...',
                        title: '...',
                        current: false
                    })
                }
            }
            const isCurrent = current === page
            rangeWithDots.push({
                title: `Go To Page ${page}`,
                position: page,
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
            path: parentLink,
            limitPerPage,
            items: this.getPaginationList(current, paginationLength, filters)
        }
    }

}

module.exports = ServiceModule