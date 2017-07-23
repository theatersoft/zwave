import {h, Component} from 'preact'
import {ListItem, Switch} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    ZWave = proxy('ZWave'),
    zwaveApi = ({method, args}) => ZWave.dispatch({type: 'API', method, args}),
    Settings = proxy('Settings'),
    settingsSet = state => Settings.setState(state)

const
    mapState = ({settings}) => ({settings}),
    mapDispatch = dispatch => ({
        api: async (id, value) => {
            await zwaveApi(id === 'add' && value ? {method: 'addNode', args: [true]}
                : id === 'remove' && value ? {method: 'removeNode', args: []}
                : {method: 'cancelControllerCommand', args: []}
            )
            await settingsSet({[`ZWave.${id}`]: value})
        }
    })


export const ServiceSettings = (ComposedComponent, props) => connect(mapState, mapDispatch)(class ServiceSettings extends Component {
    componentWillUnmount () {
        const {settings, api} = this.props
        if (settings['ZWave.add']) api('add', false)
        if (settings['ZWave.remove']) api('remove', false)
    }

    onClick = e => {
        const
            {id} = e.currentTarget.dataset,
            {settings, api} = this.props ,
            value = settings[`ZWave.${id}`]
        api(id, !value)
    }

    onChange = (value, e) => this.onClick(e)

    render ({settings}) {
        const
            item = (label, value, id) =>
                <ListItem label={label}>
                    <Switch checked={value} data-id={id} onChange={this.onChange}/>
                </ListItem>
        return (
            <ComposedComponent {...props}>
                {item('Add device', settings['ZWave.add'], 'add')}
                {item('Remove device', settings['ZWave.remove'], 'remove')}
            </ComposedComponent>
        )
    }
})