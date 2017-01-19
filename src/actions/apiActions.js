import CommandClass from '../CommandClass'
import {Type} from '@theatersoft/device'
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

const classifyDevice = (nid, {type, name, values}) => {
    const id = String(nid)
    type = ({
        'Binary Power Switch': Type.Switch,
        'Multilevel Power Switch': Type.Dimmer,
        'Home Security Sensor': Type.MotionSensor
    }[type])
    if (!type) {
        for (const match of typeMatch) {
            type = match(values)
            if (type) break
        }
    }
    if (type) {
        name = name || `ZWave.${id}`
        return {id, name, type}
    }
}

const typeMatch = [
    values => {
        if (Object.entries(values).find(([k, v]) => v.class_id === CommandClass.Alarm))
            return Type.MotionSensor
    }
]