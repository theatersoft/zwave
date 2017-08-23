import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'
import {getCidValueIndex} from '../utils'

export const polled = ({args: [id]}) => (dispatch, getState, {zwave}) => {
    const
        {cid, values} = getState().nodes[id],
        value = values[`${id}-${cid}-1-${getCidValueIndex(cid)}`]
    return zwave.isPolled(value)
}