'use strict'
const
    bus = require('@theatersoft/bus').default,
    options = {
        module: '@theatersoft/zwave',
        export: 'ZWave',
        name: 'ZWave',
        config: {
            port: '/dev/ttyACM0'
        }
    },
    service = new (require(options.module)[options.export])()

bus.start().then(() =>
    service.start(options))

process.on('SIGINT', () => {
    service.stop().then(() => {
        process.exit()
    })
})
