export const
    vidOfIndexInstance = (index, instance = 1) =>
        instance === 1 ? `${index}` : `${index}-${instance}`,
    fromOzwValue = ({value_id: _vid, node_id: nid, class_id: cid, ...rest}) =>
        ([nid, vidOfIndexInstance(rest.index, rest.instance), cid, rest])

import fs from 'fs'

export const mkdirpSync = path => {
    try {
        fs.statSync(path)
    } catch (e) {
        fs.mkdirSync(path)
    }
}
