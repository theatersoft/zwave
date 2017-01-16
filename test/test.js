'use strict'
const {start, zwave} = require('./zwave')
start(async () => {
    try {
        console.log('getNumGroups', await zwave.getNumGroups(2))

        //console.log('getMaxAssociations', await zwave.getMaxAssociations(2))
        //console.log('getAssociations', await zwave.getAssociations(2), 0)
        ////console.log('getAssociations', await zwave.getAssociations(2), 1)
        //console.log('getNumGroups', await zwave.getNumGroups(3))
        //console.log('getMaxAssociations', await zwave.getMaxAssociations(3))
        //console.log('isPrimaryController', await zwave.isPrimaryController())
        //console.log('isStaticUpdateController', await zwave.isStaticUpdateController())
        //
    }
    catch (e) {console.log(e)}
})
