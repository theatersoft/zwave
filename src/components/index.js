import {h, Component} from 'preact'
import {ListItem, Switch, Subheader} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    mapState = p => p,
    mapDispatch = dispatch => ({
        api: async (id, op, value) => {
            const
                method = op === 'add' && value ? 'addNode' : op === 'remove' && value ? 'removeNode' : 'cancelControllerCommand',
                args = [method === 'addNode']
            await proxy(id).dispatch({type: 'API', method, args})
            await proxy('Settings').setState({[`${id}.${op}`]: value})
        }
    })


export const ServiceSettings = ComposedComponent => connect(mapState, mapDispatch)(class ServiceSettings extends Component {
    componentWillUnmount () {
        const {id, settings, api} = this.props
        if (settings['${id}.add']) api(id, 'add', false)
        if (settings['${id}.remove']) api(id, 'remove', false)
    }

    onClick = e => {
        const
            {op} = e.currentTarget.dataset,
            {id, settings, api} = this.props,
            value = settings[`${id}.${op}`]
        api(id, op, !value)
    }

    onChange = (value, e) => this.onClick(e)

    render ({id, settings}) {
        const
            item = (label, op) =>
                <ListItem label={label}>
                    <Switch checked={settings[`${id}.${op}`]} data-op={op} onChange={this.onChange}/>
                </ListItem>
        return (
            <ComposedComponent>
                {item('Add device', 'add')}
                {item('Remove device', 'remove')}
            </ComposedComponent>
        )
    }
})

export const DeviceSettings = (ComposedComponent, props) => connect(mapState, mapDispatch)(class DeviceSettings extends Component {
    render ({id, devices}) {
        if (!id) return null
        const
            [, service, _id] = /^([^\.]+)\.([^]+)$/.exec(id),
            device = devices[id],
            {name, value, type} = device
        return (
            <ComposedComponent {...props}>
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
            </ComposedComponent>
        )
    }
})
