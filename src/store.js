import bus, {EventEmitter} from '@theatersoft/bus'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import reducer from './reducer'
import zwave, {setStore} from './zwave'

const store = createStore(
    reducer,
    {devices: {}},
    (composeWithDevTools({name: 'ZWave', realtime: true, port: 6400}) || (x => x))
    (applyMiddleware(thunk.withExtraArgument({zwave})))
)
setStore(store)
export default store
