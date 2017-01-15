import bus, {EventEmitter} from '@theatersoft/bus'
import {combineReducers, createStore, applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'remote-redux-devtools'
import reducer from './reducer'

export default createStore(
    reducer,
    {devices: {}},
    (composeWithDevTools({name: 'ZWave', realtime: true, port: 6400}) || (x => x))
    (applyMiddleware(thunk))
)