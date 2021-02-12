import {store} from 'src/models';

export default {
    editableContents: [
        {
            selector: options => {
                const {node} = options;
                return `th.id_${node.id}`;
            },
            propsField: 'title',
            onClick: e => options => {
                console.log('onClick column');
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
};

