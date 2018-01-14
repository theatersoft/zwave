export const
    NODE_SET = 'NODE_SET',
    nodeSet = (nid, node) => ({type: NODE_SET, nid, node}),
    NODEINFO_SET = 'NODEINFO_SET',
    nodeinfoSet = (nid, nodeinfo) => ({type: NODEINFO_SET, nid, nodeinfo}),
    VALUE_SET = 'VALUE_SET',
    valueSet = value => ({type: VALUE_SET, value}),
    VALUE_REMOVED = 'VALUE_REMOVED',
    valueRemoved = (nid, cid, index) => ({type: VALUE_REMOVED, nid, cid, index}),
    DEVICE_SET = 'DEVICE_SET',
    deviceSet = (device) => ({type: DEVICE_SET, device}),
    DEVICE_VALUE_SET = 'DEVICE_VALUE_SET',
    deviceValueSet = (id, value) => ({type: DEVICE_VALUE_SET, id, value, time: Date.now()}),
    ZWAVE_VALUE_SET = 'ZWAVE_VALUE_SET',
    zwaveValueSet = (id, value) => ({type: ZWAVE_VALUE_SET, id, value})

export * from './apiActions'
export * from './nodeActions'
export * from './valueActions'
