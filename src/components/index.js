import {h, Component} from 'preact'
import {ListItem, Switch, Button, Subheader, NestedList} from '@theatersoft/components'
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

export const ServiceSettings = (Composed, {service: {id: name}}) => connect(selectSettings, mapDispatch)(class ServiceSettings extends Component {
    componentWillUnmount () {
        const {settings, api} = this.props
        if (settings['${name}.add']) api(name, 'add', false)
        if (settings['${name}.remove']) api(name, 'remove', false)
    }

    writeConfig = () => {
        api(name, 'writeConfig')
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
                <ListItem label="OZW cache">
                    <Button label="Write" raised accent inverse onClick={this.writeConfig}/>
                </ListItem>
            </Composed>
        )
    }
})

export const DeviceSettings = (Composed, {service, id, device}) => connect(undefined, mapDispatch)(class DeviceSettings extends Component {
    state = {associations: []}

    componentDidMount () {
        api(service, 'getAssociations', Number(id), 1).then(associations => this.setState({associations}))
        settings(service, 'getState', id).then(state => this.setState(state))
    }

    clearAssociations = () => {
        const associations = this.state.associations.filter(nid => nid !== 1)
        associations.forEach(async nid => {
            await api(service, 'removeAssociation', Number(id), 1, nid) // TODO handle other groups
            this.setState({associations: this.state.associations.filter(n => n !== nid)})
        })
    }

    healNode = () => {
        settings(service, 'healNode', id)
    }

    onChangePolled = async polled => {
        await settings(service, 'setPolled', id, polled)
        this.setState({polled})
    }

    render ({api, ...props}, state) {
        const
            {name, value, type} = device,
            {associations, neighbors, polled, manufacturer, product, manufacturerid, productid} = state
        return (
            <Composed {...props}>
                <Subheader label="Manufacturer"/>
                <ListItem label={manufacturer}/>
                <Subheader label="Product"/>
                <ListItem label={product}/>
                <ListItem label={`${manufacturerid}:${productid}`}/>
                <Subheader label="Associations"/>
                <NestedList label={JSON.stringify(associations)}>
                    <ListItem label="Remove all">
                        <Button label="Clear" raised accent inverse onClick={this.clearAssociations}/>
                    </ListItem>
                </NestedList>
                <Subheader label="Polling"/>
                <ListItem label="Enabled">
                    {polled !== undefined && <Switch checked={polled} onChange={this.onChangePolled}/>}
                </ListItem>
                <Subheader label="Neighbors"/>
                <NestedList label={JSON.stringify(neighbors)}>
                    <ListItem label="Rediscover">
                        <Button label="Start" raised accent inverse onClick={this.healNode}/>
                    </ListItem>
                </NestedList>
            </Composed>
        )
    }
})
