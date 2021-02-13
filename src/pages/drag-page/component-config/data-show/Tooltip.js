export default {
    draggable: false,
    isWrapper: true,
    hooks: {
        afterPropsChange: options => {
            const {node, dragPageAction} = options;
            if (node?.props?.visible === false) {
                setTimeout(() => {
                    Reflect.deleteProperty(node.props, 'visible');

                    dragPageAction.render();
                    dragPageAction.refreshProps();
                });
            }
        },
    },
    fields: [
        {label: '显示', field: 'visible', type: 'boolean', version: '', desc: '提示信息'},
        {label: '提示信息', field: 'title', type: 'string', version: '', desc: '提示信息'},
        {label: '气泡框位置', field: 'placement', type: 'placement', defaultValue: 'top'},
    ],
};
