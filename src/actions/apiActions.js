import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType} from '@theatersoft/device'
import {ON, OFF} from './index'
import {log} from '../log'

export const
    API = 'API',
    api = action => (dispatch, getState, {zwave}) => {
        if (action.type === API) {
            const {method, args} = action
            return zwave[method](...args)
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
        //log('valueAdded', value)
        dispatch(valueSet(value))
    },
    changeValue = value => (dispatch, getState, {zwave}) => {
        //log('valueChanged', value)
        dispatch(valueSet(value))
        const
            id = String(value.node_id),
            device = getState().devices[id]
        if (!device) return
        const
            intf = interfaceOfType(device.type),
            cid = cidOfInterface(intf),
            index = getCidValueIndex(cid),
            deviceValue = normalizeInterfaceValue(intf, value.value)
        if (cid === value.class_id && index === value.index && device.value !== deviceValue)
            dispatch(deviceValueSet(id, deviceValue))
    }

import {nodeinfoSet, deviceSet} from './index'
export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        dispatch(nodeinfoSet(nid, nodeinfo))
        const device = deviceOfNode(nid, getState().nodes[nid])
        if (device) {
            dispatch(deviceSet(device))
            const cid = cidOfInterface(interfaceOfType(device.type))
            if (needsPoll(cid))
                zwave.enablePoll(nid, cid)
        }
    }

import {update} from '../cache'
const
    deviceOfNode = (id, {product, name, values}) => {
        let type = typeOfValues(values)
        if (type === Type.SecuritySensor && product && product.includes('Motion'))
            type = Type.MotionSensor
        if (type) {
            id = String(id);
            ({name, type} = update({id, name, type}))
            if (!name) name = `ZWave.${id}`
            const value = normalizeInterfaceValue(interfaceOfType(type), getTypeValuesValue(type, values))
            return {name, value, type, id}
        }
    },
    typeOfValues = values => {
        const map = new Map([
            [CommandClass.BinarySwitch, Type.Switch],
            [CommandClass.MultilevelSwitch, Type.Dimmer],
            [CommandClass.Alarm, Type.SecuritySensor]
        ])
        for (const [cid, type] of map.entries())
            if (getCidValuesValue(cid, values)) return type
    },
    cidOfInterface = intf => ({
        [Interface.SWITCH_BINARY]: CommandClass.BinarySwitch,
        [Interface.SWITCH_MULTILEVEL]: CommandClass.MultilevelSwitch,
        [Interface.SENSOR_BINARY]: CommandClass.Alarm
    }[intf]),
    getCidValuesValue = (cid, values) => {
        const entry = Object.entries(values)
            .find(([k, v]) => v.class_id === cid && v.index === getCidValueIndex(cid))
        if (entry) return entry[1]
    },
    getInterfaceValuesValue = (intf, values) => {
        const
            cid = cidOfInterface(intf),
            value = getCidValuesValue(cid, values)
        return value && value.value
    },
    normalizeInterfaceValue = (intf, value) => {
        switch (intf) {
        case Interface.SWITCH_BINARY:
        case Interface.SENSOR_BINARY:
            return !!value
        }
        return value
    },
    getTypeValuesValue = (type, values) =>
        getInterfaceValuesValue(interfaceOfType(type), values),
    getCidValueIndex = cid =>
        cid === CommandClass.Alarm ? 1 : 0,
    needsPoll = cid =>
        (cid === CommandClass.BinarySwitch || cid === CommandClass.MultilevelSwitch)

