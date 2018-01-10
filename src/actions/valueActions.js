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

const
    zwaveValue = {
        [CommandClass.Battery]: // 128
            ({value}) => ({
                $merge: {
                    battery: {value}
                }
            }),
        [CommandClass.WakeUp]: // 132
            ({value, index}) => ({
                wake: {
                    $auto: {
                        $merge: {
                            [{0: 'value', 1: 'min', 2: 'max', 3: 'default', 4: 'step'}[index]]: value
                        }
                    }
                }
            })
    }

export const
    addValue = value => (dispatch, getState, {zwave}) => {
        dispatch(valueSet(value))
        const {class_id: cid, node_id: nid} = value
        if (zwaveValue[cid])
            dispatch(zwaveValueSet(nid, zwaveValue[cid](value)))
    },
    changeValue = _value => (dispatch, getState, {zwave}) => {
        const
            state = getState(),
            [nid, vid, _cid, value] = fromOzwValue(_value),
            node = state.nodes[nid]
        if (node.values[_cid][vid].value === value.value) return
        dispatch(valueSet(_value)) //TODO
        const device = state.devices[nid]
        if (zwaveValue[_cid])
            dispatch(zwaveValueSet(nid, zwaveValue[_cid](value)))
        if (!device) return
        const
            intf = interfaceOfType(device.type),
            cid = node.cid || cidOfInterface(intf), /// ???
            index = getCidValueIndex(cid),
            deviceValue = normalizeInterfaceValue(intf, value.value)
        if (cid === _cid && index === value.index && device.value !== deviceValue)
            dispatch(timestampMotion(deviceValueSet(nid, deviceValue), intf))
    }
