// restore devices from cache before node ready
// downstream device code must allow undefined values
import fs from 'fs'
import {log} from './log'

const read = file => {try {return JSON.parse(fs.readFileSync(file, 'utf8'))} catch (e) {}}
const write = (file, json) => fs.writeFileSync(file, JSON.stringify(json, null, '  '), 'utf8')

import {deviceSet, nodeinfoSet} from './actions'

export class Cache {
    constructor (service) {
        this.service = service
        this.filename = `${service.configDir}/zwave.config.json`
    }

    load () {
        const dispatch = this.service.store.dispatch
        this.devices = read(this.filename) || {}
        if (Object.keys(this.devices).length) log(`Loaded zwave device config: ${this.filename}`)
        Object.values(this.devices).forEach(({name, type, id, cid}) => {
            dispatch(deviceSet({name, type, id}))
            cid && dispatch(nodeinfoSet(Number(id), {cid}))
        })
    }

    update ({name, type, id, cid}) {
        let device = this.devices[id] || {name, type, id}
        if (name && name !== device.name)
            device = {...device, name}
        if (!device.name)
            device = {...device, name: `${this.service.name}.${device.id}`}
        if (type && !device.type)
            device = {...device, type}
        if (cid && !device.cid)
            device = {...device, cid}
        if (this.devices[id] !== device) {
            this.devices[id] = device
            write(this.filename, this.devices)
        }
        return device
    }
}