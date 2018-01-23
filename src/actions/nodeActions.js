import {log} from '../log'
import {nodeinfoSet, deviceSet} from './index'
import CommandClass from "../CommandClass"
import {Type, Interface, interfaceOfType} from '@theatersoft/device'

const
    cidMap = ({manufacturerid, producttype, productid}) => ({
        "014a00010002": CommandClass.BinarySensor, // Ecolink Door/Window Sensor http://products.z-wavealliance.org/products/1498
        "025800030083": CommandClass.BinarySensor // Coolcam NAS-PD01ZE Motion Sensor (PIR) http://products.z-wavealliance.org/ProductManual/File?folder=&filename=Manuals/1920/Motion%20Detector%20User%20Guide%20EU%20V3.3.pdf
    }[`${manufacturerid.slice(2)}${producttype.slice(2)}${productid.slice(2)}`]),
    cidOfInterface = intf => ({
        [Interface.SWITCH_BINARY]: CommandClass.BinarySwitch,
        [Interface.SWITCH_MULTILEVEL]: CommandClass.MultilevelSwitch,
        [Interface.SENSOR_BINARY]: CommandClass.Alarm
    }[intf]),
    cidOfType = type => ({
        [Type.Lock]: CommandClass.DoorLock
    }[type]),
    getCidValueIndex = cid =>
        cid === CommandClass.Alarm ? 1 : 0,
    getCidValuesValue = (cid, values) => {
        const value = Object.values(values[cid] || {})
            .find(v => v.index === getCidValueIndex(cid))
        return value && value.value
    },
    normalizeInterfaceValue = (intf, value) => {
        switch (intf) {
        case Interface.SWITCH_BINARY:
        case Interface.SENSOR_BINARY:
            return !!value
        }
        return value
    },
    typeOfValues = values => {
        const map = new Map([
            [CommandClass.DoorLock, Type.Lock],
            [CommandClass.BinarySwitch, Type.LightSwitch],
            [CommandClass.MultilevelSwitch, Type.Dimmer],
            [CommandClass.Alarm, Type.OpenSensor]
        ])
        for (const [cid, type] of map.entries())
            if (getCidValuesValue(cid, values) !== undefined) return type
    },
    updateNodeDevice = (nid, nodeinfo, service) => {
        const {product, values} = nodeinfo
        let device,
            {name} = nodeinfo,
            type = typeOfValues(values)
        if (type === Type.OpenSensor && product && product.includes('Motion'))
            type = Type.MotionSensor
        if (type) {
            const
                id = String(nid),
                intf = interfaceOfType(type)
            let cid = cidMap(nodeinfo) || cidOfType(type) || cidOfInterface(intf);
            ({name, type, cid} = service.cache.update({id, name, type, cid}))
            const value = normalizeInterfaceValue(intf, getCidValuesValue(cid, values))
            device = {name, value, type, id}
            nodeinfo = {...nodeinfo, cid}
        }
        return [device, nodeinfo]
    }

export const
    readyNode = (nid, nodeinfo) => (dispatch, getState, {service}) => {
        log('nodeReady', nid, nodeinfo)
        const [device, info] = updateNodeDevice(nid, {...getState().nodes[nid], ...nodeinfo}, service)
        dispatch(nodeinfoSet(nid, info))
        if (device) dispatch(deviceSet(device))
    }

export {getCidValueIndex}

import NotificationCode from '../Notification'
const
    invert = o => Object.entries(o).reduce((o, [k, v]) => (o[v] = k, o), {}),
    codeKey = invert(NotificationCode)
export const
    notification = (nid, notif) => (dispatch, getState, {zwave}) => {
        log(`notification node ${nid} code ${codeKey[notif]}`)
    }