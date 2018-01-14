import {Interface, interfaceOfType, switchActions, dimmerActions} from '@theatersoft/device'
import {log} from '../log'
import {nodeinfoSet, deviceSet} from './index'
import {updateNodeDevice} from '../utils'

export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        const [device, info] = updateNodeDevice(nid, {...getState().nodes[nid], ...nodeinfo})
        dispatch(nodeinfoSet(nid, info))
        if (device) dispatch(deviceSet(device))
    }
