import {Interface, interfaceOfType, switchActions, dimmerActions} from '@theatersoft/device'
import CommandClass from '../CommandClass'
import {valueSet, deviceValueSet, zwaveValueSet} from './index'
import {fromOzwValue} from '../utils'

const
    deviceValue = ({value}) => ([, value]),
    deviceBooleanValue = ({value}) => ([, Boolean(value)]),
    maps = {
        [CommandClass.Alarm]:
            ({value, index}) => {
                const key = {0: 'type', 10: 'burglar'}[index]
                return [
                    key && {alarm: {$auto: {$merge: {[key]: value}}}},
                    index === 10 ? value : undefined
                ]
            },
        [CommandClass.Basic]: deviceBooleanValue,
        [CommandClass.BinarySensor]: deviceValue,
        [CommandClass.BinarySwitch]: deviceValue,
        [CommandClass.Battery]:
            ({value}) => ([{
                $merge: {
                    battery: {value}
                }
            }]),
        [CommandClass.MultilevelSwitch]: deviceValue,
        [CommandClass.WakeUp]:
            ({value, index}) => {
                const key = {0: 'value', 1: 'min', 2: 'max', 4: 'step'}[index]
                return [key && {wake: {$auto: {$merge: {[key]: value}}}}]
            }
    },
    mapValue = (cid, value) => maps[cid] ? maps[cid](value) : []

export const
    addValue = value => dispatch => {
        dispatch(valueSet(value))
        const {class_id: cid, node_id: nid} = value
        if (nid === 1) return
        const [zval] = mapValue(cid, value)
        if (zval) dispatch(zwaveValueSet(nid, zval))
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

        const [zval, dval] = mapValue(cid, value)
        if (zval) dispatch(zwaveValueSet(nid, zval))

        if (dval !== undefined && dval !== device.value)
            dispatch(deviceValueSet(nid, dval))

        // const
        //     intf = interfaceOfType(device.type),
        //     _cid = node.cid || cidOfInterface(intf), /// ???
        //     index = getCidValueIndex(_cid),
        //     deviceValue = normalizeInterfaceValue(intf, value.value)
        // if (cid === _cid && index === value.index && device.value !== deviceValue)
        //     dispatch(timestampMotion(deviceValueSet(nid, deviceValue), intf))
    }
