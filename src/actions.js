export const
    INIT_DEVICES = 'INIT_DEVICES',
    SET_VALUE = 'SET_VALUE',
    SET_NODE = 'SET_NODE'
export const
    initDevices = devices => ({type: INIT_DEVICES, devices}),
    setValue = value => ({type: SET_VALUE, value}),
    setNode = (nid, node) => ({type: SET_NODE, nid, node})

// zwave api
export const
    API = 'API',
    API_INCLUDE = 'API_INCLUDE',
    API_EXCLUDE = 'API_EXCLUDE',
    API_CANCEL = 'API_CANCEL'
export const
    api = (method, args) => ({type: API, method, args}),
    apiInclude = () => ({type: API_INCLUDE}),
    apiExclude = () => ({type: API_EXCLUDE}),
    apiCancel = () => ({type: API_CANCEL})

// switch
export const
    ON = 'ON',
    OFF = 'OFF'
export const
    on = id => ({type: ON, id}),
    off = id => ({type: OFF, id})
