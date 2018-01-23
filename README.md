# @theatersoft/zwave
`zwave` is a [Theatersoft](https://www.theatersoft.com) [bus](https://github.com/theatersoft/bus) service module that
encapsulates the [OpenZWave](https://github.com/OpenZWave) library to provide consistent [device](https://github.com/theatersoft/device) APIs for Z-Wave device control and state management. It also exports [client](https://github.com/theatersoft/client) components for Z-Wave service and device configuration.

## Installation
1. Install [Theatersoft Home](https://www.theatersoft.com/install). 

2. Connect a USB Z-Wave controller supported by OpenZWave.   

3. Add a ZWave service configuration object to your site `config.json` to the `services` array of a `hosts` object. E.g:
    ```json
    {
        "module": "@theatersoft/zwave",
        "export": "ZWave",
        "name": "ZWave",
        "config": {
            "port": "/dev/ttyACM0",
            "options": {
                "NetworkKey": "0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,0x10,0x11,0x12,0x13,0x14,0x15,0x16",
                "Logging": true,
                "ConsoleOutput": true,
                "SaveLogLevel": 5
            }
        }
    }    
    ```
    *NetworkKey is the secret 16 byte value used for secure communication with security devices.*
     
4. `npm run config deploy` to complete `zwave` service installation.

## Operation
The `zwave` service settings will appear in the Settings/Services UI.

Use `Add device` and `Remove device` to perform include and exclude controller operations.

Once a device is added, it appears in the Device menu under its detected type. Additional ZWave device details and settings are available with a hold press.

## API

`zwave` implement the types and interfaces exported from [device](https://github.com/theatersoft/device). Theatersoft Device types are influenced by the need to support the wide range of Z-Wave devices but all low level Z-Wave details (Command Class implementation, configuration, etc.) are hidden and managed within the service. 

### State

Device state is published on the service bus object as a Device. E.g.:
```
    "ZWave.26" : {
        name: "Office",
        value: false,
        type: "Switch",
        id: "ZWave.26",
        time: 1516389670608
    }
```

### Control
Actions control devices through the service`dispatch (action :Action)` API. A typical action for a `Switch` would be `on`, exported from `device` as `on = id => ({type: ON, id})`.

### REPL demo
Start node using an installed NPM script to set the BUS environment: 
```bash
cd /opt/theatersoft && npm explore @theatersoft/zwave npm run BUS -- node
```
Start the bus and create a `zwave` service proxy:
```js
const {bus, proxy} = require('@theatersoft/bus')
bus.start()
const zwave = proxy('ZWave')
```
Then get the service state and check the devices:
```js
zwave.getState().then(state => devices = state.devices)
devices // show the returned devices
```
Let's find the devices that are on:
```js
Object.values(devices).find(({value}) => value)
``` 
Suppose that returned `{ name: 'Kitchen outlet', value: true, type: 'Switch', id: '5' }`. Then we could turn it off:
```js
zwave.dispatch({type: 'OFF', id: '5' })
``` 
