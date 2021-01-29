export default {
    initialState: {
        pageConfig: {
            __config: {
                isRoot: true,
                isContainer: true,
                componentId: '1',
                componentDesc: '我是最外层',
            },
            componentName: 'div',
            style: {margin: 6, padding: 16, background: 'green'},
            children: [
                {
                    __config: {
                        componentId: '12',
                        isContainer: true,
                    },
                    componentName: 'div',
                    style: {background: 'blue', height: 200, color: '#fff'},
                },
                {
                    __config: {
                        componentId: '2',
                        componentDesc: '黑色div',
                        isContainer: true,
                    },
                    componentName: 'div',
                    style: {background: 'black', color: '#fff'},
                    children: [
                        {
                            __config: {
                                componentId: '1222',
                            },
                            componentName: 'span',
                            children: ['啥玩意 兄弟 灰色 div'],
                        },
                        {
                            __config: {
                                isContainer: true,
                                componentId: '22',
                            },
                            componentName: 'div',
                            style: {width: 300, height: 200, background: 'grey'},
                        },
                    ],
                },
                {
                    __config: {
                        componentId: '3',
                    },
                    componentName: 'Button',
                    type: 'primary',
                    children: [
                        '好的啊',
                    ],
                },
                {
                    __config: {
                        componentId: '4',
                    },
                    componentName: 'Select',
                    style: {width: 100},
                    options: [
                        {value: 1, label: '哈哈'},
                        {value: 2, label: '咿呀'},
                    ],
                },
                {
                    __config: {
                        componentId: '5',
                    },
                    componentName: 'div',
                    style: {margin: 6, width: 500, background: 'yellow'},
                    children: [
                        '啥玩意',
                        {
                            __config: {
                                componentId: '7',
                                componentType: 'ra-lib',
                            },
                            componentName: 'Table',
                            surplusSpace: false,
                            columns: [{title: '姓名', dataIndex: 'name'}],
                            dataSource: [{name: '张三'}, {name: '李四'}],
                        },
                    ],
                },
            ],

        },
        selectedNodeId: null,
    },
    setFields: fields => ({...fields}),
    setPageConfig: pageConfig => ({pageConfig}),
    addNode: ({node, targetId, isBefore, isAfter, isChildren}, state) => {
        const {pageConfig} = state;

        return modifyPageConfig({
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
        });
    },
    moveNode: ({sourceId, targetId, isBefore, isAfter, isChildren}, state) => {
        const {pageConfig} = state;

        const [node] = deleteNodeById(pageConfig, sourceId);

        return modifyPageConfig({
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
        });
    },
};

function modifyPageConfig(options) {
    const {
        pageConfig,
        targetId,
        isChildren,
        isBefore,
        isAfter,
        node,
    } = options;

    // targetId 节点所在children
    const targetCollection = findChildrenCollection(pageConfig, targetId);

    const targetNode = findNodeById(pageConfig, targetId);

    if (isChildren) {
        if (!targetNode.children) targetNode.children = [];
        targetNode.children.push(node);

        return {pageConfig: {...pageConfig}};
    }

    if (!targetCollection) return;

    if (isBefore) {
        const index = targetCollection.findIndex(item => item.__config?.componentId === targetId);
        targetCollection.splice(index, 0, node);
    }

    if (isAfter) {
        const index = targetCollection.findIndex(item => item.__config?.componentId === targetId);
        targetCollection.splice(index + 1, 0, node);
    }

    return {pageConfig: {...pageConfig}};
}

function findChildrenCollection(root, id) {
    if (root.__config?.componentId === id) return null;

    if (!root.children) return null;

    if (root.children.some(item => item.__config?.componentId === id)) {
        return root.children;
    } else {
        for (let node of root.children) {
            const result = findChildrenCollection(node, id);
            if (result) return result;
        }
    }
}

function findNodeById(root, id) {
    if (root.__config?.componentId === id) return root;

    if (!root.children) return null;

    for (let node of root.children) {
        const result = findNodeById(node, id);
        if (result) return result;
    }
}

function deleteNodeById(root, id) {
    if (!root.children) return [];
    const index = root.children.findIndex(item => item.__config?.componentId === id);
    if (index > -1) {
        return root.children.splice(index, 1);
    } else {
        for (let item of root.children) {
            const result = deleteNodeById(item, id);
            if (result?.length) return result;
        }
    }
}
