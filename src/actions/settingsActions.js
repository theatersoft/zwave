import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import CommandClass from "../CommandClass"

const
    valueId = (nid, cid) => ({node_id: nid, class_id: cid, index: 0, instance: 1}),
    isSwitch = cid => cid === CommandClass.BinarySwitch || cid === CommandClass.MultilevelSwitch,
    invert = o => Object.entries(o).reduce((o, [k, v]) => (o[v] = k, o), {}),
    inverseCC = invert(CommandClass)

export const
    getState = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes, zwave: _zwave} = getState(),
            {cid, values, ...info} = nodes[id]
        return {
            neighbors: zwave.getNodeNeighbors(id),
            ...isSwitch(cid) && {polled: zwave.isPolled(valueId(id, cid))},
            ...info,
            ..._zwave[id],
            classes: Object.keys(values).map(cid => `${cid} ${inverseCC[cid]}`)
        }
    },
    setPolled = ({args: [id, value]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes} = getState(),
            {cid} = nodes[id],
            v = valueId(id, cid)
        return value ? zwave.enablePoll(v, 1) : zwave.disablePoll(v)
    },
    healNode = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        zwave.healNetworkNode(id)
    }
