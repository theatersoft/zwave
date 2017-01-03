export const
    ON = 'ON',
    OFF = 'OFF',
    BRIGHT = 'BRIGHT',
    DIM = 'DIM'

export const on = id => ({type: ON, id})
export const off = id => ({type: OFF, id})
export const bright = (id, n) => ({type: BRIGHT, id, n})
export const dim = (id, n) => ({type: DIM, id, n})

export const
    SET_VALUE = 'setvalue',
    SET_NODE = 'setnode'

export const
    setValue = value => ({type: SET_VALUE, value}),
    setNode = info => ({type: SET_NODE, info})


