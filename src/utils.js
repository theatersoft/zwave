import CommandClass from './CommandClass'
import {Type, Interface, interfaceOfType} from '@theatersoft/device'
import {log} from './log'
import {update} from './cache'

export const
    updateNodeDevice = (nid, nodeinfo) => {
        const {product, values} = nodeinfo
        let device,
            {name} = nodeinfo,
            type = typeOfValues(values)
        if (type === Type.OpenSensor && product && product.includes('Motion'))
            type = Type.MotionSensor
        if (type) {
            const
                id = String(nid),
                intf = interfaceOfType(type),
                cid = cidMap(nodeinfo) || cidOfInterface(intf);
            ({name, type} = update({id, name, type, cid}))
            if (!name) name = `ZWave.${id}`
            const value = normalizeInterfaceValue(intf, getCidValuesValue(cid, values))
            device = {name, value, type, id}
            nodeinfo = {...nodeinfo, cid}
        }
        return [device, nodeinfo]
    },
    typeOfValues = values => {
        const map = new Map([
            [CommandClass.BinarySwitch, Type.Switch],
            [CommandClass.MultilevelSwitch, Type.Dimmer],
            [CommandClass.Alarm, Type.OpenSensor]
        ])
        for (const [cid, type] of map.entries())
            if (getCidValuesValue(cid, values) !== undefined) return type
    },
    cidOfInterface = intf => ({
        [Interface.SWITCH_BINARY]: CommandClass.BinarySwitch,
        [Interface.SWITCH_MULTILEVEL]: CommandClass.MultilevelSwitch,
        [Interface.SENSOR_BINARY]: CommandClass.Alarm
    }[intf]),
    getNodeValue = (id, nodes) => {
        const {cid, values} = nodes[id]
        return values[`${id}-${cid}-1-${getCidValueIndex(cid)}`]
    },
    getCidValuesValue = (cid, values) => {
        const value = Object.values(values)
            .find(v => v.class_id === cid && v.index === getCidValueIndex(cid))
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
    getCidValueIndex = cid =>
        cid === CommandClass.Alarm ? 1 : 0,
    timestampMotion = (action, intf) =>
        Object.assign(action, intf === Interface.SENSOR_BINARY && {time: Date.now()}),
    cidMap = ({manufacturerid, producttype, productid}) => ({
        "014a00010002": CommandClass.BinarySensor, // Ecolink Door/Window Sensor http://products.z-wavealliance.org/products/1498
        "025800831083": CommandClass.BinarySensor // Coolcam NAS-PD01ZE Motion Sensor (PIR) http://products.z-wavealliance.org/ProductManual/File?folder=&filename=Manuals/1920/Motion%20Detector%20User%20Guide%20EU%20V3.3.pdf
    }[`${manufacturerid.slice(2)}${producttype.slice(2)}${productid.slice(2)}`])

import fs from 'fs'
export const mkdirpSync = path => {
    try {
        fs.statSync(path)
    } catch (e) {
        fs.mkdirSync(path)
    }
}