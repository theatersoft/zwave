import * as base from '@theatersoft/bus'

const format = (...args) => (['ZWAVE', ...args])

export const log = (...args) => base.log(...format(...args))
export const error = (...args) => base.error(...format(...args))