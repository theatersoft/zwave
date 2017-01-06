import bus, {EventEmitter} from '@theatersoft/bus'
import {combineReducers, createStore} from 'redux'
import reducer from './reducer'

export default createStore(reducer, {devices: []})