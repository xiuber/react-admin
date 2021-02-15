import {handleAfterRender} from 'src/pages/drag-page/util';

export default {
    editableContents: [
        {
            selector: '.ant-collapse-header',
            onInput: e => options => {
                const {node, index} = options;
                node.children[index].props.header = e.target.innerText;
            },
        },
    ],
    isContainer: true,
    withDragProps: false,
    hooks: {
        afterRender: handleAfterRender,
    },
    dropAccept: ['Collapse.Panel'],
    fields: [],
};
