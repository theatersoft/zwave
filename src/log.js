import util from 'util'
util.inspect.defaultOptions = {breakLength: Infinity}

export const log = (...args) => console.log(
    new Date().toLocaleTimeString(),
    ...args)
