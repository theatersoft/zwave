import CommandClass from './CommandClass'
import {SET_VALUE, SET_NODE, INIT_DEVICES, API_INCLUDE, API_EXCLUDE, API_CANCEL} from './actions'
import {ON, OFF} from './actions'
import {API} from './actions'
import zwave from './zwave'

const valueReducers = {
    Alarm (state, {class_id, label, value}, device) {
        if (class_id === CommandClass.Alarm && label === 'Alarm Level'
            && state.values[device.id] !== !!value // TODO shallow compare if value is object
        )
            return {
                ...state,
                values: {...state.values, [device.id]: !!value}
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
    case SET_NODE:
        return {
            ...state,
            nodes: {...state.nodes, [action.nid]: action.node}
        }
    case INIT_DEVICES:
        return {...state, devices: action.devices}
    case API_INCLUDE:
        zwave.addNode(true)
        return {...state, inclusion: 1}
    case API_EXCLUDE:
        zwave.removeNode()
        return {...state, inclusion: -1}
    case API_CANCEL:
        zwave.cancelControllerCommand()
        return {...state, inclusion: undefined}
    case ON:
    case OFF:
        zwave.setValue(Number(action.id), CommandClass.BinarySwitch, 1, 0, action.type === ON)
        break // TODO value changed
    case API:
        zwave[action.method](...(action.args || []))
        break
    }
    return state
}