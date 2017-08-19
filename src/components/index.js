import {h, Component} from 'preact'
import {ListItem, Switch, Subheader} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    selectSettings = ({settings}) => ({settings}),
    selectDevices = ({devices}) => ({devices}),
    mapDispatch = dispatch => ({
        api: async (name, op, value) => {
            const
                method = op === 'add' && value ? 'addNode' : op === 'remove' && value ? 'removeNode' : 'cancelControllerCommand',
                args = [method === 'addNode']
            await proxy(name).dispatch({type: 'API', method, args})
            await proxy('Settings').setState({[`${name}.${op}`]: value})
        }
    })

export const ServiceSettings = (Composed, {service: {name}}) => connect(selectSettings, mapDispatch)(class ServiceSettings extends Component {
    componentWillUnmount () {
        const {settings, api} = this.props
        if (settings['${name}.add']) api(name, 'add', false)
        if (settings['${name}.remove']) api(name, 'remove', false)
    }

    onClick = e => {
        const
            {op} = e.currentTarget.dataset,
            {settings, api} = this.props,
            value = settings[`${name}.${op}`]
        api(name, op, !value)
    }

    onChange = (value, e) => this.onClick(e)

    render ({settings, api, ...props}) {
        const
            item = (label, op) =>
                <ListItem label={label}>
                    <Switch checked={settings[`${name}.${op}`]} data-op={op} onChange={this.onChange}/>
                </ListItem>
        return (
            <Composed {...props}>
                {item('Add device', 'add')}
                {item('Remove device', 'remove')}
            </Composed>
        )
    }
})

export const DeviceSettings = (Composed, props) => connect(selectDevices, mapDispatch)(class DeviceSettings extends Component {
    render ({id, devices}) {
        if (!id) return null
        const
            [, service, _id] = /^([^\.]+)\.([^]+)$/.exec(id),
            device = devices[id],
            {name, value, type} = device
        return (
            <Composed {...props}>
                <Subheader label="Service"/>
                <ListItem label={service}/>
                <Subheader label="Type"/>
                <ListItem label={type}/>
                <Subheader label="ID"/>
                <ListItem label={_id}/>
                <Subheader label="Name"/>
                <ListItem label={name}/>
                <Subheader label="Value"/>
                <ListItem label={String(value)}/>
            </Composed>
        )
    }
})
