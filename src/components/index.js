import {h, Component} from 'preact'
import {ListItem, Switch, Button} from '@theatersoft/components'
import {proxy} from '@theatersoft/bus'
import {connect} from './redux'

const
    selectSettings = ({settings}) => ({settings}),
    selectDevices = ({devices}) => ({devices}),
    api = (name, method, ...args) => proxy(name).dispatch({type: 'API', method, args}),
    settings = (name, method, ...args) => proxy(name).dispatch({type: 'SETTINGS', method, args}),
    mapDispatch = dispatch => ({
        api: async (name, op, value) => {
            const
                method = op === 'add' && value ? 'addNode' : op === 'remove' && value ? 'removeNode' : 'cancelControllerCommand',
                args = [method === 'addNode']
            await api(name, method, args)
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

export const DeviceSettings = (Composed, {service, id, device}) => connect(undefined, mapDispatch)(class DeviceSettings extends Component {
    state = {associations: []}

    componentDidMount () {
        api(service, 'getAssociations', Number(id), 1).then(associations => this.setState({associations}))
        settings(service, 'polled', id).then(polled => this.setState({polled}))
    }

    clearAssociations = () => {
        const associations = this.state.associations.filter(nid => nid !==1)
        associations.forEach(async nid => {
            await api(service, 'removeAssociation', [Number(id), 1, nid]) // TODO handle other groups
            this.setState({associations: this.state.associations.filter(n => n !== nid)})
        })
    }

    render ({api, ...props}, {associations, polled}) {
        const
            {name, value, type} = device
        return (
            <Composed {...props}>
                <ListItem label="Associations">
                    <Button label="Clear" raised accent inverse onClick={this.clearAssociations}/>
                </ListItem>
                <ListItem label={JSON.stringify(associations)}/>
                <ListItem label="Associations"/>
                <ListItem label="Polled">
                    {polled !== undefined && <Switch checked={polled}/>}
                </ListItem>
            </Composed>
        )
    }
})
