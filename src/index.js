import zwave from './zwave'
import store from './store'
import bus, {EventEmitter} from '@theatersoft/bus'
import {log} from './log'
import {initDevices} from './actions'

// BABEL BUG
//const select = getState => ({devices, nodes, ...rest} = getState()) => ({devices, ...rest})
const select = getState => () => {
    const {devices} = getState()
    return {devices}
}
//const equal = (a, b) => (a === b)
// selected objects require shallow comparison
const equal = (a, b, _a = Object.keys(a), _b = Object.keys(b)) => (
    _a.length === _b.length && !_a.find(k =>
        !_b.includes(k) || a[k] !== b[k]
    )
)

const dedup = (getState, _state = getState()) => f => (_next = getState()) => {
    if (!equal(_next, _state)) {
        _state = _next
        f(_next)
    }
}

export class ZWave {
    start ({name, config: {port, devices}}) {
        Object.assign(this, {name, port})
        return bus.registerObject(name, this)
            .then(() => {
                store.dispatch(initDevices(devices))
                store.subscribe(dedup(select(store.getState))(state =>
                    bus.signal(`/${this.name}.state`, state)))
                zwave.connect(this.port)
                const register = () => bus.proxy('Device').registerService(this.name)
                bus.registerListener(`/Device.started`, register)
                register()
            })
    }

    stop () {
        return bus.unregisterObject(this.name)
            .then(() => zwave.disconnect(this.port))
    }

    dispatch (action) {
        return store.dispatch(action)
    }

    getState () {
        return store.getState()
    }
}
