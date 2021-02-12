export default {
    dropAccept: 'Column',
    withWrapper: true,
    fields: [],
    hooks: {
        beforeRender: options => {
            const {node} = options;
            setTableColumns(node);
        },
        beforeSchemaEdit: options => {
            const {node} = options;
            Reflect.deleteProperty(node.props, 'columns');
        },
    },
};


function setTableColumns(tableNode) {
    if (!tableNode) return;

    let {children} = tableNode;
    if (!tableNode.props) tableNode.props = {};
    if (!tableNode.props.columns) tableNode.props.columns = [];

    if (!children?.length) {
        tableNode.props.columns = [];
        return;
    }

    const loop = (node, columns) => {
        const {id, props, children} = node;
        const col = {...props, className: `id_${id}`};
        columns.push(col);
        if (children?.length) {
            col.children = [];
            children.forEach(item => loop(item, col.children));
        }
    };
    const columns = [];
    children.forEach(node => loop(node, columns));

    tableNode.props.columns = columns;
}

