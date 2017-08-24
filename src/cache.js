// restore devices from cache before node ready
// downstream device code must allow undefined values
import fs from 'fs'
import {log} from './log'

const THEATERSOFT_CONFIG_HOME = `${process.env.XDG_CONFIG_HOME || `${process.env.HOME}/.config`}/theatersoft`
const filename = `${THEATERSOFT_CONFIG_HOME}/zwave.config.json`
const read = () => {try {return JSON.parse(fs.readFileSync(filename, 'utf8'))} catch (e) {}}
const write = cache => fs.writeFileSync(filename, JSON.stringify(cache), 'utf8')
let cache

import {deviceSet, nodeinfoSet} from './actions'

export const load = dispatch => {
    cache = read() || {}
    if (Object.keys(cache).length) log(`Loaded zwave device config: ${filename}`)
    Object.values(cache).forEach(({name, type, id, cid}) => {
        dispatch(deviceSet({name, type, id}))
        cid && dispatch(nodeinfoSet(Number(id), {cid}))
    })
}

export const update = ({name, type, id, cid}) => {
    let device = cache[id] || {name, type, id}
    if (name && name !== device.name)
        device = {...device, name}
    if (type && !device.type)
        device = {...device, type}
    if (cid && cid !== device.cid)
        device = {...device, cid}
    if (cache[id] !== device) {
        cache[id] = device
        write(cache)
    }
    return device
}

