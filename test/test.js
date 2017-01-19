'use strict'
const {start, zwave} = require('./zwave')
start(async () => {
    try {
        const nid = 7

        //zwave.writeConfig()
        //console.log('getNeighbors', await zwave.getNeighbors())

        //await zwave.getNumGroups(nid) // 1
        //await zwave.getMaxAssociations(nid, 1) // 5
        //await zwave.getAssociations(nid, 1) // [ 1, 255 ]
        //await zwave.removeAssociation(nid, 1, 255)

//2017-01-19 09:42:21.209 Info, Node007, Association::Remove - Removing node 255 from group 1 of node 7
//2017-01-19 09:42:21.209 Detail,
//2017-01-19 09:42:21.209 Detail, Node007, Queuing (WakeUp) AssociationCmd_Remove (Node=7): 0x01, 0x0b, 0x00, 0x13, 0x07, 0x04, 0x85, 0x04, 0x01, 0xff, 0x25, 0x52, 0xec
//2017-01-19 09:42:21.209 Info, Node007, Get Associations for group 1 of node 7
//2017-01-19 09:42:21.209 Detail,
//2017-01-19 09:42:21.209 Detail, Node007, Queuing (WakeUp) AssociationCmd_Get (Node=7): 0x01, 0x0a, 0x00, 0x13, 0x07, 0x03, 0x85, 0x02, 0x01, 0x25, 0x53, 0x12

        //console.log('hasNodeFailed', await zwave.hasNodeFailed(nid))
        //console.log('removeFailedNode', await zwave.removeFailedNode(nid))

        await zwave.removeNode()
        //await zwave.addNode(true)
        //zwave.cancelControllerCommand()

        //await zwave.setNodeName(3, 'Outdoor switch')
        //await zwave.setNodeName(5, 'Kitchen outlet')
        //await zwave.setNodeName(6, 'Studio door')
        //await zwave.setNodeName(7, 'Kitchen motion')
        //await zwave.setNodeName(8, 'Hallway')

        //await zwave.healNetwork()

        //console.log('getNeighbors', await zwave.getNeighbors())
        //console.log('refreshNodeInfo', await zwave.refreshNodeInfo(3))

        //zwave.setValue(3, 0x25, 1, 0, false)


        //console.log('isPrimaryController', await zwave.isPrimaryController())
        //console.log('isStaticUpdateController', await zwave.isStaticUpdateController())
        //
    }
    catch (e) {console.log(e)}
})
