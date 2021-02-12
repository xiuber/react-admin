import {findParentNodeByParentName} from 'src/pages/drag-page/util';
import {store} from 'src/models';

export default {
    editableContents: [
        {
            selector: options => {
                const {node} = options;
                return `.${node.props.className}`;
            },
            onInput: e => options => {
                const {node, pageConfig} = options;
                if (!node.props) node.props = {};
                node.props.title = e.target.innerText;

                syncTableColumns({node, pageConfig});
            },
            onClick: e => options => {
                const {node, dragPageAction} = options;
                const {nodeSelectType} = store.getState().dragPage;
                if (nodeSelectType === 'meta') {
                    if ((e.metaKey || e.ctrlKey)) {
                        e.stopPropagation();
                        // 单纯选中节点，不进行其他操作
                        dragPageAction.setSelectedNodeId(node.id);
                    }
                }

                // 单击模式
                if (nodeSelectType === 'click') {
                    e.stopPropagation();
                    dragPageAction.setSelectedNodeId(node.id);
                }
            },
        },
    ],
    render: false,
    dropAccept: 'Column',
    dropInTo: ['Table', 'Column'],
    fields: [
        {label: '名称', field: 'title', type: 'string'},
        {label: '字段名', field: 'dataIndex', type: 'string'},
        {label: '宽度', field: 'width', type: 'unit'},
    ],
    componentDisplayName: ({node}) => {
        const title = node.props?.title || '';

        return `Column ${title}`;
    },
    hooks: {
        afterAdd: options => {
            const {node} = options;
            node.props.className = `id_${node.id}`;

            syncTableColumns(options);
        },
        afterMove: syncTableColumns,
        // node 已经不存在了，使用 targetNode
        afterDelete: ({targetNode, pageConfig}) => syncTableColumns({node: targetNode, pageConfig}),
        afterPropsChange: syncTableColumns,
    },
};

function syncTableColumns(options) {
    let {node, pageConfig} = options;
    if (!pageConfig) pageConfig = store.getState().dragPage.pageConfig;

    const tableNode = findParentNodeByParentName(pageConfig, 'Table', node.id);
    setTableColumns(tableNode);
}

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
        const {props, children} = node;
        const col = {...props};
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
