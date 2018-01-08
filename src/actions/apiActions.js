import CommandClass from '../CommandClass'
import {Interface, interfaceOfType, switchActions, dimmerActions} from '@theatersoft/device'
import {log} from '../log'
import * as settingsApi from './settingsActions'

const
    {ON, OFF} = switchActions,
    {SET} = dimmerActions

export const
    API = 'API',
    SETTINGS = 'SETTINGS',
    api = action => (dispatch, getState, {zwave}) => {
        if (action.type === API) {
            const {method, args} = action
            return zwave[method](...args)
        }
        if (action.type === SETTINGS) {
            const {method} = action
            return settingsApi[method](action)(dispatch, getState, {zwave})
        }
        const
            {id, type} = action,
            device = getState().devices[id]
        if (!device) throw `no device for ${action}`
        const
            intf = interfaceOfType(device.type)
        switch (intf) {
        case Interface.SWITCH_BINARY: {
            switch (type) {
            case ON:
            case OFF:
                zwave.setValue(Number(id), CommandClass.BinarySwitch, 1, 0, action.type === ON)
                return
            }
            return
        }
        case Interface.SWITCH_MULTILEVEL: {
            const value = type === SET ? action.value
                : type === ON ? 255
                    : type === OFF ? 0
                        : undefined
            if (value !== undefined)
                zwave.setValue(Number(id), CommandClass.MultilevelSwitch, 1, 0, value)
            return
        }
        }
    }

import {nodeinfoSet, deviceSet} from './index'
import {updateNodeDevice} from '../utils'

export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        const [device, info] = updateNodeDevice(nid, {...getState().nodes[nid], ...nodeinfo})
        dispatch(nodeinfoSet(nid, info))
        if (device) dispatch(deviceSet(device))
    }


