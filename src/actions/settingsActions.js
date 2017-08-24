import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'
import {getNodeValue} from '../utils'

export const
    getState = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        const
            {nodes} = getState(),
            nid = Number(id)
        return {
            neighbors: zwave.getNodeNeighbors(nid),
            polled: zwave.isPolled(getNodeValue(id, getState().nodes))
        }
    },
    setPolled = ({args: [id, value]}) => (dispatch, getState, {zwave}) => {
        const
            {cid} = getState().nodes[id]
        return zwave[value ? 'enablePoll' : 'disablePoll'](Number(id), cid)
    },
    healNode = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        zwave.healNetworkNode(Number(id))
    }
