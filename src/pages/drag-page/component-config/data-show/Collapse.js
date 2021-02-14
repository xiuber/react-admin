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
    withWrapper: true,
    dropAccept: ['Collapse.Panel'],
    fields: [],
};
