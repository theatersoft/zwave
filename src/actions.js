export const
    SET_VALUE = 'SET_VALUE',
    SET_NODE = 'SET_NODE',
    ADD_NODE = 'ADD_NODE',
    REMOVE_NODE = 'REMOVE_NODE',
    CANCEL_CMD = 'CANCEL_CMD',
    INIT_DEVICES = 'INIT_DEVICES'

export const
    setValue = value => ({type: SET_VALUE, value}),
    setNode = info => ({type: SET_NODE, info}),
    addNode = () => ({type: ADD_NODE}),
    removeNode = () => ({type: REMOVE_NODE}),
    cancelCmd = () => ({type: CANCEL_CMD}),
    initDevices = devices => ({type: INIT_DEVICES, devices})


export const
    ON = 'ON',
    OFF = 'OFF'

export const
    on = id => ({type: ON, id}),
    off = id => ({type: OFF, id})
