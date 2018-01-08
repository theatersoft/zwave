import {Interface, interfaceOfType, switchActions, dimmerActions} from '@theatersoft/device'
import {valueSet, deviceValueSet} from './index'
import {fromOzwValue} from '../utils'
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

export const
    addValue = value => (dispatch, getState, {zwave}) => {
        dispatch(valueSet(value))
    },
    changeValue = _value => (dispatch, getState, {zwave}) => {
        const
            state = getState(),
            [nid, vid, _cid, value] = fromOzwValue(_value),
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
