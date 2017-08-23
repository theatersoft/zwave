import CommandClass from '../CommandClass'
import {Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'
import * as settingsApi from './settingsActions'

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
            {ON, OFF} = switchActions,
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
            switch (type) {
            case ON:
            case OFF:
                zwave.setValue(Number(id), CommandClass.MultilevelSwitch, 1, 0, action.type === ON ? 255 : 0)
                return
            }
            return
        }
        }
    }

import {valueSet, deviceValueSet} from './index'
export const
    addValue = value => (dispatch, getState, {zwave}) => {
        dispatch(valueSet(value))
    },
    changeValue = value => (dispatch, getState, {zwave}) => {
        const
            state = getState(),
            {node_id, value_id} = value,
            node = state.nodes[node_id]
        if (node.values[value_id].value === value.value) return
        dispatch(valueSet(value))
        const device = state.devices[node_id]
        if (!device) return
        const
            intf = interfaceOfType(device.type),
            cid = node.cid || cidOfInterface(intf), /// ???
            index = getCidValueIndex(cid),
            deviceValue = normalizeInterfaceValue(intf, value.value)
        if (cid === value.class_id && index === value.index && device.value !== deviceValue)
            dispatch(timestampMotion(deviceValueSet(node_id, deviceValue), intf))
    }

import {nodeinfoSet, deviceSet} from './index'
export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        const [device, info] = updateNodeDevice(nid, {...getState().nodes[nid], ...nodeinfo})
        dispatch(nodeinfoSet(nid, info))
        if (device) {
            dispatch(deviceSet(device))
            if (needsPoll(info.cid))
                zwave.enablePoll(nid, info.cid)
        }
    }

import {
    updateNodeDevice,
    typeOfValues,
    cidOfInterface,
    getCidValuesValue,
    normalizeInterfaceValue,
    getCidValueIndex,
    needsPoll,
    timestampMotion,
    cidMap
} from '../utils'

