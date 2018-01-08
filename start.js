require('@theatersoft/server/lib').startLocalService({
    module: '@theatersoft/zwave',
    export: 'ZWave',
    name: process.argv[3] || 'ZWave',
    config: {
        remotedev: 'localhost',
        port: process.argv[2] || '/dev/zwave',
        options: {
            Logging: true,
            ConsoleOutput: true,
            SaveLogLevel: 7
        }
    }
})