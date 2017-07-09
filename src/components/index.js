import {h, Component} from 'preact'
import {ListItem, Switch} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const ZWave = proxy('ZWave')
export const zwaveApi = ({method, args}) => () => ZWave.dispatch({type: 'API', method, args})

const
    mapStateToProps = ({devices = {}}) => ({devices}),
    mapDispatchToProps = dispatch => ({dispatchZWaveApi: action => dispatch(zwaveApi(action))})

export const AddDevice = connect(mapStateToProps, mapDispatchToProps)(class extends Component {
    state = {add: false}

    onChange = (value, _e) => {
        this.props.dispatchZWaveApi(value ? {method: 'cancelControllerCommand', args: []} : {method: 'addNode', args: [true]})
            .then(() => this.setState({sw: value}))
    }

    render ({dispatchZWaveApi, devices}, {add}) {
        return (
            <ListItem label="Add device">
                <Switch checked={add} onChange={this.onChange}/>
            </ListItem>
        )
    }
})