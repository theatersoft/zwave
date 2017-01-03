import CommandClass from './CommandClass'
import {SET_VALUE, on, OFF, off} from './actions'

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
    }
    return state
}