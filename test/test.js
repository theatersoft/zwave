'use strict'
const {start, zwave} = require('./zwave')
start(async () => {
    try {
        //console.log('getNumGroups', await zwave.getNumGroups(2))

        //console.log('getMaxAssociations', await zwave.getMaxAssociations(2))

        // double free crash
        //console.log('getAssociations', await zwave.getAssociations(2), 0)

        //const nid = 4
        //console.log('hasNodeFailed', await zwave.hasNodeFailed(nid))
        //console.log('removeFailedNode', await zwave.removeFailedNode(nid))

        //await zwave.addNode(true)
        //zwave.cancelControllerCommand()

        //await zwave.setNodeName(3, 'Outdoor switch')
        //await zwave.setNodeName(7, 'Kitchen motion')

        //await zwave.healNetwork()

        //console.log('getNeighbors', await zwave.getNeighbors())
        //console.log('refreshNodeInfo', await zwave.refreshNodeInfo(3))

        zwave.setValue(3, 0x25, 1, 0, false)

        //console.log('getNumGroups', await zwave.getNumGroups(3))
        //console.log('getMaxAssociations', await zwave.getMaxAssociations(3))
        //console.log('isPrimaryController', await zwave.isPrimaryController())
        //console.log('isStaticUpdateController', await zwave.isStaticUpdateController())
        //
    }
    catch (e) {console.log(e)}
})
