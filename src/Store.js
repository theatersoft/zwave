import bus, {EventEmitter} from '@theatersoft/bus'
import {ON, on, OFF, off} from './actions'

export class Store extends EventEmitter {
    constructor (reducer, initial = {}) {
        super()
        this.state = initial
        this.reducer = reducer
    }

    getState () {
        return this.state
    }

    dispatch (action) {
        const last = this.state
        this.state = this.reducer(last, action)
        if (this.state !== last) {
            this.emit('change', this.state)
        }
    }
}

function reducer (state, action) {
    //switch (action.type) {
    //}
    return state
}

export default class extends Store {
    constructor (devices = []) {
        super(reducer, {})
        console.log(this.state)
    }
}