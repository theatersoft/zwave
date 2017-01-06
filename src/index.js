import zwave from './zwave'
import store from './store'
import bus, {EventEmitter} from '@theatersoft/bus'
import {log} from './log'
import {initDevices} from './actions'

export class ZWave {
    start ({name, config: {port, devices}}) {
        Object.assign(this, {name, port})
        return bus.registerObject(name, this)
            .then(() => {
                store.dispatch(initDevices(devices))
                store.subscribe(() =>
                    bus.signal(`/${this.name}.change`, store.getState()))
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
