import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {getNodeOzwValue} from '../utils'

export const
    getState = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes} = getState(),
            {cid, values, ...others} = nodes[id]
        return {
            neighbors: zwave.getNodeNeighbors(id),
            polled: zwave.isPolled(getNodeOzwValue(id, nodes)),
            ...others
        }
    },
    setPolled = ({args: [id, value]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes} = getState(),
            v = getNodeOzwValue(id, nodes)
        return value ? zwave.enablePoll(v, 1) : zwave.disablePoll(v)
    },
    healNode = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        zwave.healNetworkNode(id)
    }
