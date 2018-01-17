# @theatersoft/zwave
`zwave` is a [Theatersoft](https://www.theatersoft.com) [bus](https://github.com/theatersoft/bus) service module that
encapsulates the [OpenZWave](https://github.com/OpenZWave) library to provide consistent [device](https://github.com/theatersoft/device) APIs for Z-Wave device control and state management. It also exports [client](https://github.com/theatersoft/client) components for Z-Wave service and device configuration.

## Installation
1. Install [Theatersoft](https://www.theatersoft.com). 

2. Connect an OpenZWave supported USB Z-Wave controller, and optionally configure a udev rule to symlink `/dev/zwave` used in the config below (or modify the port name as needed).   

3. Add a ZWave service configuration object to your site `config.json` to the `services` array of a `hosts` object. E.g:
    ```json
       {
          "module": "@theatersoft/zwave",
          "export": "ZWave",
          "name": "ZWave",
          "config": {
            "port": "/dev/zwave",
            "options": {
              "Logging": true,
              "ConsoleOutput": true,
              "SaveLogLevel": 5
            }
          }
        }      
    ```
    
4. `npm run config deploy` if you installed Theatersoft using `@theatersoft/home`; otherwise install `@theatersoft/zwave`
and restart the server manually.  