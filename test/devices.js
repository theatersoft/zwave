'use strict'
const
    {bus, log} = require('@theatersoft/bus'),
    {CommandClass} = require('@theatersoft/zwave'),
    zwave = bus.proxy('ZWave'),
    toJson = o => JSON.stringify(o, null, ' '),
    columnify = (...cols) => (...strs) => strs.reduce((s, str, i) => s + (String(str) || '').slice(0, cols[i] && (cols[i] - 1)).padEnd(cols[i]), ''),
    invert = o => Object.entries(o).reduce((o, [k, v]) => (o[v] = k, o), {}),
    inverseCC = invert(CommandClass)

bus.start().then(async () => {
    try {
        const {nodes, devices, zwave: _zwave} = await zwave.getState()

        const all = Object.entries(nodes)
            .map(([nid, o]) => ({nid, ...o}))
            .filter(({nid, values}) => nid !== '1' && values)

        log(`\n${all.length} devices`)
        all.forEach(({nid, cid, type, manufacturer, product, values}) => {
            log(columnify(4, 16, 26, 14, 50)(nid, devices[nid].name, type, manufacturer, product))
        })

        const alarms = all.map(({values, ...o}) => ({
                ...o,
                values,
                alarmValues: values[113] && Object.values(values[113])
                    .map(({label}) => label)
            }))
            .filter(o => o.alarmValues)

        log('\ncommand class alarm value labels')
        alarms
            .forEach(({nid, cid, type, manufacturer, product, alarmValues}) => {
                log(columnify(4, 16, 16, 5, 26)(nid, devices[nid].name, devices[nid].type, cid, type, alarmValues.toString()))
            })

        log('\nalarm devices all command classes')
        alarms.forEach(o => {
            o.cids = {}
            Object.keys(o.values).forEach(k => o.cids[k] = true)
            log(columnify(4, 16)(o.nid, devices[o.nid].name, Object.keys(o.cids).toString()))
        })

        log('\ncommand classes')
        const cids = alarms.reduce((cids, n) => (Object.keys(n.cids).forEach(cid => cids[cid] = true), cids), {})
        Object.keys(cids).forEach(cid => log(cid, inverseCC[cid]))

        const matchCid = cid => all.filter(({values}) => Object.keys(values).find(k => k == cid))
        const logCid = cid => log(`${cid}:`, matchCid(cid).map(({nid}) => nid).toString())

        log('\ndevices by selected command classes')
        logCid(48)
        logCid(49)
        logCid(113)

        log('\nalarm values')
        matchCid(113).forEach(({nid}) => log(`${nid}:`, _zwave[nid].alarm))
    }
    catch (e) {console.log(e)}
})
