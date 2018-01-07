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
        case Interface.SWITCH_BINARY:
        {
            switch (type) {
            case ON:
            case OFF:
                zwave.setValue(Number(id), CommandClass.BinarySwitch, 1, 0, action.type === ON)
                return
            }
            return
        }
        case Interface.SWITCH_MULTILEVEL:
        {
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

import {valueSet, deviceValueSet} from './index'
import {valueFilter} from '../utils'

export const
    addValue = value => (dispatch, getState, {zwave}) => {
        dispatch(valueSet(value))
    },
    changeValue = _value => (dispatch, getState, {zwave}) => {
        const
            state = getState(),
            [nid, vid, _cid, value] = valueFilter(_value),
            node = state.nodes[nid]
        if (node.values[_cid][vid].value === value.value) return
        dispatch(valueSet(_value)) //TODO
        const device = state.devices[nid]
        if (!device) return
        const
            intf = interfaceOfType(device.type),
            cid = node.cid || cidOfInterface(intf), /// ???
            index = getCidValueIndex(cid),
            deviceValue = normalizeInterfaceValue(intf, value.value)
        if (cid === _cid && index === value.index && device.value !== deviceValue)
            dispatch(timestampMotion(deviceValueSet(nid, deviceValue), intf))
    }

import {nodeinfoSet, deviceSet} from './index'
export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        const [device, info] = updateNodeDevice(nid, {...getState().nodes[nid], ...nodeinfo})
        dispatch(nodeinfoSet(nid, info))
        if (device) dispatch(deviceSet(device))
    }

import {
    updateNodeDevice,
    typeOfValues,
    cidOfInterface,
    getCidValuesValue,
    normalizeInterfaceValue,
    getCidValueIndex,
    timestampMotion,
    cidMap
} from '../utils'

