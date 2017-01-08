import CommandClass from './CommandClass'
import {SET_VALUE, INIT_DEVICES, ADD_NODE, REMOVE_NODE, CANCEL_CMD} from './actions'
import {ON, OFF, on, off} from './actions'
import zwave from './zwave'

const valueReducers = {
    Alarm (state, {class_id, label, value}, device) {
        if (class_id === CommandClass.Alarm && label === 'Alarm Level') return {
            ...state,
            [device.id]: {value: !!value}
        }
        return state
    }
}

export default function reducer (state, action) {
    switch (action.type) {
    case SET_VALUE:
        const device = state.devices.find(d => d.id === String(action.value.node_id))
        if (device)
            return valueReducers[device.type](state, action.value, device)
        break
    case INIT_DEVICES:
        return {...state, devices: action.devices}
    case ADD_NODE:
        zwave.addNode(true)
        return {...state, inclusion: 1}
    case REMOVE_NODE:
        zwave.removeNode()
        return {...state, inclusion: -1}
    case CANCEL_CMD:
        zwave.cancelControllerCommand()
        return {...state, inclusion: undefined}
    case ON:
        zwave.setValue(Number(action.id), CommandClass.BinarySwitch, 1, 0, true)
        return {
            ...state,
            [action.id]: {value: true, action: off(action.id)}
        }
    case OFF:
        zwave.setValue(Number(action.id), CommandClass.BinarySwitch, 1, 0, false)
        return {
            ...state,
            [action.id]: {value: false, action: on(action.id)}
        }
    }
    return state
}