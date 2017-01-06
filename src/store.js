import bus, {EventEmitter} from '@theatersoft/bus'
import {combineReducers, createStore} from 'redux'
import devToolsEnhancer from 'remote-redux-devtools'
import reducer from './reducer'

export default createStore(
    reducer,
    {devices: []},
    devToolsEnhancer({name: 'ZWave', realtime: true, port: 6400})
)