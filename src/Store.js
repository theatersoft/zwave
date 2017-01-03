import bus, {EventEmitter} from '@theatersoft/bus'
import reducer from './reducer'

export class Store extends EventEmitter {
    constructor (reducer, state = {}) {
        super()
        Object.assign(this, {reducer, state})
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

export default class extends Store {
    constructor (devices = []) {
        super(reducer, {devices})
        console.log(this.state)
    }
}