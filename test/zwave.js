'use strict'
const
    {bus} = require('@theatersoft/bus'),
    zwave = new Proxy({}, {get: (_, method) => (...args) => bus.proxy('ZWave').dispatch({type: 'API', method, args}).then(r => console.log(method, r))})
module.exports = {
    start: f => bus.start().then(() => f(zwave))
}