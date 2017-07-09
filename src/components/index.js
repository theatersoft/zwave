import {h} from 'preact'
import {ListItem, Switch} from '@theatersoft/components'

// TEST ONLY
export const AddDevice = () =>
    <ListItem label="Add device">
        <Switch checked={false}/>
    </ListItem>