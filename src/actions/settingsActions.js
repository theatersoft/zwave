import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'
import {getNodeValue} from '../utils'

export const
    getState = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes} = getState(),
            {cid, values, ...others} = nodes[id]
        return {
            neighbors: zwave.getNodeNeighbors(id),
            polled: zwave.isPolled(getNodeValue(id, nodes)),
            ...others
        }
    },
    setPolled = ({args: [id, value]}) => (dispatch, getState, {zwave}) => {
        const
            {cid} = getState().nodes[id]
        return zwave[value ? 'enablePoll' : 'disablePoll'](id, cid)
    },
    healNode = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        zwave.healNetworkNode(id)
    }
