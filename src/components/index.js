import {h, Component} from 'preact'
import {ListItem, Switch, Subheader} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    mapState = props => p => ({...p, ...props}),
    mapDispatch = dispatch => ({
        api: async (name, id, value) => {
            const
                method = id === 'add' && value ? 'addNode' : id === 'remove' && value ? 'removeNode' : 'cancelControllerCommand',
                args = [method === 'addNode']
            await proxy(name).dispatch({type: 'API', method, args})
            await proxy('Settings').setState({[`${name}.${id}`]: value})
        }
    })


export const ServiceSettings = (ComposedComponent, props) => connect(mapState(props), mapDispatch)(class ServiceSettings extends Component {
    componentWillUnmount () {
        const {name, settings, api} = this.props
        if (settings['${name}.add']) api(name, 'add', false)
        if (settings['${name}.remove']) api(name, 'remove', false)
    }

    onClick = e => {
        const
            {id} = e.currentTarget.dataset,
            {name, settings, api} = this.props ,
            value = settings[`${name}.${id}`]
        api(name, id, !value)
    }

    onChange = (value, e) => this.onClick(e)

    render ({name, settings}) {
        const
            item = (label, value, id) =>
                <ListItem label={label}>
                    <Switch checked={value} data-id={id} onChange={this.onChange}/>
                </ListItem>
        return (
            <ComposedComponent {...props}>
                {item('Add device', settings['${name}.add'], 'add')}
                {item('Remove device', settings['${name}.remove'], 'remove')}
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
