import zwave from './zwave'
import store from './store'
import bus, {EventEmitter} from '@theatersoft/bus'
import {log} from './log'
import {initDevices} from './actions'

const dedup = (getState, _state = getState()) => f => (_next = getState()) => {
    if (_next !== _state) {
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
                store.subscribe(dedup(store.getState)(state =>
                    bus.signal(`/${this.name}.state`, state)))
                zwave.connect(this.port)
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
