import {createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import reducer from './reducer'
import {createZwave, setZwaveStore} from './zwave'
import {bus} from '@theatersoft/bus'
import {log} from './log'
import {api} from './actions'
import {load} from './cache'

const select = getState => ({devices, nodes} = getState()) => ({devices})

// selected objects require shallow comparison
const equal = (a, b, _a = Object.keys(a), _b = Object.keys(b)) => (
    _a.length === _b.length && !_a.find(k => !_b.includes(k) || a[k] !== b[k])
)

const dedup = (getState, _state = {}) => f => (_next = getState()) => {
    if (!equal(_next, _state)) {
        _state = _next
        f(_next)
    }
}

export class ZWave {
    start ({name, config: {port, options, remotedev}}) {
        Object.assign(this, {name, port})
        return bus.registerObject(name, this)
            .then(obj => {
                this.zwave = createZwave(options)
                this.store = createStore(reducer, {devices: {}, nodes: []},
                    (remotedev && composeWithDevTools({name: 'ZWave', realtime: true, port: 6400, hostname: remotedev}) || (x => x))
                    (applyMiddleware(thunk.withExtraArgument({zwave: this.zwave}))))
                setZwaveStore(this.zwave, this.store)
                this.zwave.connect(this.port)
                load(this.store.dispatch)
                this.store.subscribe(dedup(select(this.store.getState))(state =>
                    obj.signal('state', state)))
                const register = () => bus.proxy('Device').registerService(this.name)
                bus.registerListener(`Device.start`, register)
                bus.on('reconnect', register)
                register()
            })
    }

    stop () {
        return bus.unregisterObject(this.name)
            .then(() => this.zwave.disconnect(this.port))
    }

    dispatch (action) {
        return this.store.dispatch(api(action))
    }

    getState () {
        return this.store.getState()
    }
}
