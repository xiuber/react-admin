import {v4 as uuid} from 'uuid';

export default {
    hooks: {
        beforeRender: options => {
            const {node} = options;
            if (!node.props) node.props = {};
            node.props.name = `formName_${uuid()}`;
        },
    },
    fields: [],
};
