import CommandClass from '../CommandClass'
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

import {valueSet} from './index'
export const
    addValue = (value) => (dispatch, getState, {zwave}) => {
        log('valueAdded', value)
        dispatch(valueSet(value))
        //TODO update device value
    },
    changeValue = (value) => (dispatch, getState, {zwave}) => {
        log('valueChanged', value)
        dispatch(valueSet(value))
        //TODO update device value
    }

import {nodeinfoSet, deviceSet} from './index'
export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {zwave}) => {
        log('nodeReady', nid, nodeinfo)
        dispatch(nodeinfoSet(nid, nodeinfo))
        const device = classifyDevice(nid, getState().nodes[nid])
        if (device) dispatch(deviceSet(device))
    }

//import {DeviceInterface, DeviceType} from '@theatersoft/device'
const DeviceInterface = {
    SWITCH_BINARY: 'SwitchBinary',
    SWITCH_MULTILEVEL: 'SwitchMultilevel',
    SENSOR_BINARY: 'SensorBinary',
    SENSOR_MULTILEVEL: 'SensorMultilevel'
}
const classifyDevice = (nid, {type, name, values}) => {
    const id = String(nid)
    switch (type) {
    case 'Binary Power Switch':
        return {id, name, intf: DeviceInterface.SWITCH_BINARY}
    case 'Multilevel Power Switch':
        return {id, name, intf: DeviceInterface.SWITCH_MULTILEVEL}
    case 'Home Security Sensor':
        return {id, name, intf: DeviceInterface.SENSOR_BINARY}
    }
}
