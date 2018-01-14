import {Interface, interfaceOfType, switchActions, dimmerActions} from '@theatersoft/device'
import CommandClass from '../CommandClass'
import {valueSet, deviceValueSet, zwaveValueSet} from './index'
import {fromOzwValue} from '../utils'
import {
    cidOfInterface,
    normalizeInterfaceValue,
    getCidValueIndex,
    timestampMotion,
} from '../utils'

const maps = {
        [CommandClass.Alarm]: // 113
            ({value, index}) => {
                const key = {0: 'type', 1: 'level', 10: 'burglar'}[index]
                return key && {alarm: {$auto: {$merge: {[key]: value}}}}
            },
        [CommandClass.Basic]: // 32
            ({value}) => ({
                $merge: {
                    basic: {value: Boolean(value)} // 0 | 255
                }
            }),
        [CommandClass.BinarySensor]: // 48
            ({value}) => ({
                $merge: {
                    binarySensor: {value} // boolean
                }
            }),
        [CommandClass.Battery]: // 128
            ({value}) => ({
                $merge: {
                    battery: {value} // 0-100 %
                }
            }),
        [CommandClass.WakeUp]: // 132
            ({value, index}) => {
                const key = {0: 'value', 1: 'min', 2: 'max', 3: 'default', 4: 'step'}[index]
                return key && {wake: {$auto: {$merge: {[key]: value}}}}
            }
    },
    dispatchZwaveValueSet = (dispatch, nid, cid, value) => {
        const val = maps[cid] && maps[cid](value)
        if (val) dispatch(zwaveValueSet(nid, val))
    }

export const
    addValue = value => dispatch => {
        dispatch(valueSet(value))
        const {class_id: cid, node_id: nid} = value
        if (nid === 1) return
        dispatchZwaveValueSet(dispatch, nid, cid, value)
    },
    changeValue = _value => (dispatch, getState) => {
        const
            state = getState(),
            [nid, vid, cid, value] = fromOzwValue(_value),
            node = state.nodes[nid]
        if (node.values[cid][vid].value === value.value) return
        dispatch(valueSet(_value)) //TODO
        const device = state.devices[nid]
        if (!device) return
        dispatchZwaveValueSet(dispatch, nid, cid, value)
        const
            intf = interfaceOfType(device.type),
            _cid = node.cid || cidOfInterface(intf), /// ???
            index = getCidValueIndex(_cid),
            deviceValue = normalizeInterfaceValue(intf, value.value)
        if (cid === _cid && index === value.index && device.value !== deviceValue)
            dispatch(timestampMotion(deviceValueSet(nid, deviceValue), intf))
    }
