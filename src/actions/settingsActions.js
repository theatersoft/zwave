import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'
import {getNodeValue} from '../utils'

export const
    polled = ({args: [id]}) => (dispatch, getState, {zwave}) => {
        return zwave.isPolled(getNodeValue(id, getState().nodes))
    },
    setPolled = ({args: [id, value]}) => (dispatch, getState, {zwave}) => {
        const {cid} = getState().nodes[id]
        return zwave[value ? 'enablePoll' : 'disablePoll'](Number(id), cid)
    }
