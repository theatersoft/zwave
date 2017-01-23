// restore devices from cache before node ready
// downstream device code must allow undefined values
import fs from 'fs'
const filename = `${process.env.HOME}/.config/theatersoft/zwave-cache.json`
const read = () => {try {return JSON.parse(fs.readFileSync(filename, 'utf8'))} catch (e) {}}
const write = cache => fs.writeFileSync(filename, JSON.stringify(cache), 'utf8')
let cache

import {deviceSet, api} from './actions'

export const load = dispatch => {
    cache = read() || {}
    Object.values(cache).forEach(device =>
        dispatch(deviceSet(device)))
}

export const update = ({id, name, type}) => {
    let device = cache[id] || {id, name, type}
    if (name && name !== device.name)
        device = {...device, name}
    if (type && type !== device.type)
        device = {...device, type}
    if (cache[id] !== device) {
        cache[id] = device
        write(cache)
    }
    return device
}

