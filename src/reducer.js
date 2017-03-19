import {log} from './log'
import CommandClass from './CommandClass'
import {NODE_SET, NODEINFO_SET, VALUE_SET, VALUE_REMOVED, DEVICE_SET, DEVICE_VALUE_SET} from './actions'

export default function reducer (state, action) {
    switch (action.type) {
    case NODE_SET:
    {
        const {nid} = action
        return {
            ...state, nodes: {
                ...state.nodes, [nid]: {
                    ...state.nodes[nid],
                    values: {},
                    ready: false
                }
            }
        }
    }
    case NODEINFO_SET:
    {
        const {nid, nodeinfo} = action
        return {
            ...state, nodes: {
                ...state.nodes, [nid]: {
                    ...state.nodes[nid],
                    ...nodeinfo,
                    ready: true
                }
            }
        }
    }
    case VALUE_SET:
    {
        const
            {value} = action,
            {node_id, value_id} = value,
            node = state.nodes[node_id]
        if (!node) break
        return {
            ...state, nodes: {
                ...state.nodes, [node_id]: {
                    ...node, values: {
                        ...node.values, [value_id]: value
                    }
                }
            }
        }
    }
    case VALUE_REMOVED:
    {
        const {nid, cid, index} = action
        log('value removed', nid, cid, index)
        debugger
    }
    case DEVICE_SET:
    {
        log(action)
        const {device} = action
        return {
            ...state, devices: {
                ...state.devices, [device.id]: device
            }
        }
    }
    case DEVICE_VALUE_SET:
    {
        log(action)
        const
            {id, value, time} = action,
            device = state.devices[id]
        return {
            ...state, devices: {
                ...state.devices, [id]: time ? {...device, value, time} : {...device, value}
            }
        }
    }
    }
    return state
}