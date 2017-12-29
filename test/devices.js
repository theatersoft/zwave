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
        const {nodes, devices} = await zwave.getState()

        const all = Object.entries(nodes)
            .map(([nid, o]) => ({nid, ...o}))
            .filter(({nid}) => nid != 1)

        log()
        all.forEach(({nid, cid, type, manufacturer, product, values}) => {
            log(columnify(4, 16, 26, 14, 50)(nid, devices[nid].name, type, manufacturer, product))
        })

        const alarms = all.map(({values, ...o}) => ({
                ...o,
                values,
                alarmValues: Object.values(values)
                    .filter(({class_id}) => class_id === 113)
                    .map(({label}) => label)
            }))
            .filter(o => o.alarmValues.length)

        log()
        alarms
            .forEach(({nid, cid, type, manufacturer, product, alarmValues}) => {
                log(columnify(4, 16, 16, 5, 26)(nid, devices[nid].name, devices[nid].type, cid, type, alarmValues.toString()))
            })

        log()
        alarms.forEach(o => {
            o.cids = {}
            Object.values(o.values).forEach(v => o.cids[v.class_id] = true)
            log(columnify(4, 16)(o.nid, devices[o.nid].name, Object.keys(o.cids).toString()))
        })

        log()
        const cids = alarms.reduce((cids, n) => (Object.keys(n.cids).forEach(cid => cids[cid] = true), cids), {})
        Object.keys(cids).forEach(cid => log(cid, inverseCC[cid]))

        const matchCid = cid => all.filter(({values}) => Object.values(values).find(({class_id}) => class_id === cid))
        const logCid = cid => log(`${cid}:`, matchCid(cid).map(({nid}) => nid).toString())

        log()
        logCid(48)
        logCid(49)
        logCid(113)
    }
    catch (e) {console.log(e)}
})
