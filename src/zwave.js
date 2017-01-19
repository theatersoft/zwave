import OpenZwave from 'openzwave-shared'
import CommandClass from './CommandClass'
import Notification from './Notification'
import {log} from './log'
import {nodeSet, readyNode, addValue, changeValue, valueRemoved} from './actions'

const zwave = new OpenZwave({
    Logging: true,
    ConsoleOutput: true,
    SaveConfiguration: true
})
export default zwave
export function setStore ({dispatch}) {
    zwave
        .on('connected', v => log('connected', v))
        .on('driver ready', hid => log(`driver ready`, hid.toString(16)))
        .on('driver failed', () => (log('driver failed'), zwave.disconnect()))
        .on('node added', nid => dispatch(nodeSet(nid)))
        .on('value added', (nid, cid, value) => dispatch(addValue(value)))
        .on('value changed', (nid, cid, value) => dispatch(changeValue(value)))
        .on('value removed', (nid, cid, index) => dispatch(valueRemoved(nid, cid, index)))
        .on('node ready', (nid, nodeinfo) => dispatch(readyNode(nid, nodeinfo)))
        .on('notification', (nid, notif) => log('notification', nid, notif))
        .on('scan complete', () => log('scan complete'))
        .on('controller command', (r, s) => log('controller commmand feedback', r, s))
}

