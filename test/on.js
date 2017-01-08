'use strict'

require('@theatersoft/bus').bus.start().then(bus =>
    bus.proxy('ZWave').dispatch({type: 'ON', id: '3'}))
