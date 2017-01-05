'use strict'
const
    {default: bus, proxy} = require('@theatersoft/bus'),
    ZWave = proxy('ZWave')

bus.start().then(() =>
    ZWave.dispatch({type: 'ADD_NODE'}))
