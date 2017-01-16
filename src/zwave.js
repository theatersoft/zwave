import OpenZwave from 'openzwave-shared'
import store from './store'
import CommandClass from './CommandClass'
import Notification from './Notification'
import {log} from './log'
import {setValue, setNode} from './actions'

const
    keyOfValue = (o, v) => Object.keys(o).find(k => o[k] == v),
    cidString = cid => keyOfValue(CommandClass, cid),
    nodes = []
const zwave = new OpenZwave({
    Logging: false,     // disable file logging (OZWLog.txt)
    ConsoleOutput: true // enable console logging
})
export default zwave
export function setStore (store) {
    zwave
        .on('connected', v => log('connected', v))
        .on('driver ready', hid => log(`driver ready`, hid.toString(16)))
        .on('driver failed', () => {
            log('driver failed')
            zwave.disconnect()
        })
        .on('node added', nid => {
            log('node added', nid)
            nodes[nid] = {
                //manufacturer, manufacturerid, product, producttype, productid, type, name, loc
                cids: {},
                ready: false
            }
            store.dispatch(setNode(nid, nodes[nid]))
        })
        .on('value added', (nid, cid, value) => {
            log('value added', nid, cidString(cid), value)
            if (!nodes[nid].cids[cid]) nodes[nid].cids[cid] = {}
            nodes[nid].cids[cid][value.index] = value
        })
        .on('value changed', (nid, cid, value) => {
            log('value changed', nid, cidString(cid), {old: nodes[nid].cids[cid][value.index].value, new: value.value}, value)
            //if (nodes[nid].ready) {}
            nodes[nid].cids[cid][value.index] = value
            store.dispatch(setValue(value))
        })
        .on('value removed', (nid, cid, index) => {
            log('value removed', nid, cid, index)
            //if (nodes[nid].cids[cid])
            delete nodes[nid].cids[cid][index]
        })
        .on('node ready', (nid, nodeinfo) => {
            log('node ready', nid, nodeinfo)
            Object.assign(nodes[nid], nodeinfo, {ready: true})
            for (const cid in nodes[nid].cids) {
                switch (cid) {
                case CommandClass.BinarySwitch:
                case CommandClass.MultilevelSwitch:
                    zwave.enablePoll(nid, cid)
                    break
                }
                const values = nodes[nid].cids[cid]
                log(`+++ node ${nid} class ${cidString(cid)} values`)
                for (const i in values) log(values[i].label, values[i].value)
            }
            log('nodes', nodes)
        })
        .on('notification', (nid, notif) => {
            log('notification', nid, keyOfValue(Notification, notif))
            log('nodes', nodes)
        })
        .on('scan complete', () => {
            log('scan complete')
        })
        .on('controller command', (r, s) => {
            log('controller commmand feedback', r, s)
        })
}

