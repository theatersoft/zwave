require('@theatersoft/server/lib').startLocalService({
    module: '@theatersoft/zwave',
    export: 'ZWave',
    name: 'ZWave',
    config: {
        remotedev: 'localhost',
        port: '/dev/zwave',
        options: {
            Logging: true,
            ConsoleOutput: true,
            "SaveLogLevel": 7
        }
    }
})