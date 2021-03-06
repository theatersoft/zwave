import OpenZwave from 'openzwave-shared'
import {log} from './log'
import {nodeSet, readyNode, addValue, changeValue, valueRemoved, notification} from './actions'

let port

export function createZwave ({port: p, options, UserPath}) {
    port = p
    return new OpenZwave({
        Logging: false,
        ConsoleOutput: false,
        SaveConfiguration: true,
        UserPath,
        ...options
    })
}

export function setZwaveStore (zwave, {dispatch}) {
    zwave
        .on('connected', v =>
            log('connected', v)
        )
        .on('driver ready', hid =>
            log(`driver ready`, hid.toString(16))
        )
        .on('driver failed', () => {
            log('driver failed')
            zwave.disconnect(port)
        })
        .on('node added', nid =>
            dispatch(nodeSet(nid))
        )
        .on('value added', (nid, cid, value) =>
            dispatch(addValue(value))
        )
        .on('value changed', (nid, cid, value) =>
            dispatch(changeValue(value))
        )
        .on('value removed', (nid, cid, index) =>
            dispatch(valueRemoved(nid, cid, index))
        )
        .on('node ready', (nid, nodeinfo) =>
            dispatch(readyNode(nid, nodeinfo))
        )
        .on('notification', (nid, notif) =>
            dispatch(notification(nid, notif))
        )
        .on('scan complete', () => {
            log('scan complete')
            zwave.writeConfig()
        })
        .on('controller command', (r, s) =>
            log('controller commmand feedback', r, s)
        )
}

