import CommandClass from '../CommandClass'
import {Type, Interface, toInterface} from '@theatersoft/device'
import {ON, OFF} from './index'
import {log} from '../log'

export const
    API = 'API',
    api = action => (dispatch, getState, {zwave}) => {
        switch (action.type) {
        case API:
            const {method, args} = action
            return zwave[method](...args)
        case ON:
        case OFF:
            zwave.setValue(Number(action.id), CommandClass.BinarySwitch, 1, 0, action.type === ON)
            break // TODO value changed
        }
    }

import {valueSet, deviceValueSet} from './index'
export const
    addValue = (value) => (dispatch, getState, {zwave}) => {
        log('valueAdded', value)
        dispatch(valueSet(value))
    },
    changeValue = (value) => (dispatch, getState, {zwave}) => {
        log('valueChanged', value)
        dispatch(valueSet(value))
        const
            id = String(value.node_id),
            device = getState().devices[id]
        if (device && getTypeCid(device.type) === value.class_id)
            dispatch(deviceValueSet(id, value.value))
    }

import {nodeinfoSet, deviceSet} from './index'
export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        dispatch(nodeinfoSet(nid, nodeinfo))
        const device = classifyDevice(nid, getState().nodes[nid])
        if (device) dispatch(deviceSet(device))
    }

const classifyDevice = (nid, {type, name, values}) => {
    const id = String(nid)
    type = {
        'Binary Power Switch': Type.Switch,
        'Multilevel Power Switch': Type.Dimmer,
        'Home Security Sensor': Type.MotionSensor
    }[type]
    if (!type) {
        for (const match of typeMatch) {
            type = match(values)
            if (type) break
        }
    }
    if (type) {
        name = name || `ZWave.${id}`
        const value = getTypeValue(type, values)
        return {id, name, type, value}
    }
}

const
    getCidValue = (cid, values) => {
        const entry = Object.entries(values).find(([k, v]) => v.class_id === cid)
        if (entry) return entry[1]
    },
    typeMatch = [
        values => getCidValue(CommandClass.Alarm, values) && Type.MotionSensor
    ],
    getTypeCid = type => ({
        [Interface.SWITCH_BINARY]: CommandClass.BinarySwitch
    }[toInterface(type)]),
    getTypeValue = (type, values) => {
        const reader = {
            [Interface.SWITCH_BINARY]: values => getCidValue(CommandClass.BinarySwitch, values)
        }[toInterface(type)]
        if (reader) {
            const value = reader(values)
            return value && value.value
        }
    }