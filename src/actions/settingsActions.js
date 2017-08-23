import CommandClass from '../CommandClass'
import {Type, Interface, interfaceOfType, switchActions} from '@theatersoft/device'
import {log} from '../log'

export const polled = action => (dispatch, getState, {zwave}) => {
    log('polled', action)
}