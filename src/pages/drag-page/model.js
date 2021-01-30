import {findNodeById} from './util';

const holderNode = {
    __config: {
        draggable: false,
        componentId: '1',
    },
    componentName: 'DragHolder',
};

export default {
    initialState: {
        activeToolKey: 'layout', // 头部激活 key
        selectedNodeId: null,
        selectedNode: null,
        draggingNode: null, // 正在拖动的节点 key
        showCode: false, // 显示代码
        // showSide: false, // 左侧是否显示
        showSide: true,
        // activeSideKey: null, // 左侧激活key
        activeSideKey: 'componentTree',
        activeTabKey: 'attribute', // 右侧激活tab key

        componentTreeExpendedKeys: [], // 组件树 展开节点

        pageConfig: {
            __config: {
                draggable: false,
                componentId: '1',
                componentDesc: '我是最外层',
            },
            // componentName: 'DragHolder',
            componentName: 'div',
            style: {margin: 6, padding: 16, background: 'yellow'},
            children: [
                {
                    __config: {
                        componentId: '12',
                        dropAccept: ['Text'],
                    },
                    componentName: 'div',
                    style: {background: 'blue', height: 200, color: '#fff'},
                },
                {
                    __config: {
                        componentId: '2',
                        componentDesc: '黑色div',
                    },
                    componentName: 'div',
                    style: {background: 'black', color: '#fff'},
                    children: [
                        {
                            __config: {
                                componentId: '1222',
                            },
                            componentName: 'span',
                            // children: ['啥玩意 兄弟 灰色 div'],
                            children: [
                                {
                                    __config: {
                                        componentId: '666',
                                        isContainer: false,
                                    },
                                    componentName: 'Text',
                                    text: '文本啊啊',
                                },
                            ],
                        },
                        {
                            __config: {
                                isContainer: false,
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
                        isContainer: false,
                    },
                    componentName: 'Button',
                    type: 'primary',
                    children: [
                        {
                            __config: {
                                componentId: '777',
                                draggable: false,
                                isContainer: false,
                            },
                            componentName: 'Text',
                            text: '真的是文本啊',
                        },
                    ],
                },
                {
                    __config: {
                        componentId: '4',
                        isContainer: false,
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
                        {
                            __config: {
                                componentId: '888',
                                isContainer: false,
                            },
                            componentName: 'Text',
                            text: '啥玩意',
                        },
                        {
                            __config: {
                                componentId: 'col',
                                isContainer: false,
                            },
                            componentName: 'Column',
                            children: [
                                {
                                    __config: {
                                        componentId: '88008',
                                        isContainer: false,
                                        draggable: false,
                                    },
                                    componentName: 'Text',
                                    text: '我是列',
                                },
                            ],
                        },
                        {
                            __config: {
                                componentId: '7',
                                dropAccept: ['Column'],
                                // isContainer: false,
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
    },
    setComponentTreeExpendedKeys: componentTreeExpendedKeys => ({componentTreeExpendedKeys}),
    setDraggingNode: draggingNode => ({draggingNode}),
    setActiveTabKey: activeTabKey => {
        return {activeTabKey};
    },
    setActiveSideKey: (activeSideKey) => {
        return {activeSideKey};
    },
    showSide: (showSide) => {
        return {showSide};
    },
    showCode: (showCode) => {
        return {showCode};
    },
    saveSchema: () => {
        // TODO
        console.log('TODO saveSchema');
    },
    save: () => {
        // TODO
        console.log('TODO save');
    },
    prevStep: () => {
        // TODO
    },
    nextStep: () => {
        // TODO
    },
    setActiveTookKey: activeToolKey => {
        return {activeToolKey};
    },
    setSelectedNodeId: (selectedNodeId, state) => {
        let {pageConfig, componentTreeExpendedKeys} = state;

        const selectedNode = findNodeById(pageConfig, selectedNodeId);

        const parentKeys = getParentIds([pageConfig], selectedNodeId);
        if (parentKeys?.length) {
            if (!componentTreeExpendedKeys) componentTreeExpendedKeys = [];
            parentKeys.forEach(key => {
                if (key && !componentTreeExpendedKeys.some(k => k === key)) {
                    componentTreeExpendedKeys.push(key);
                }
            });
        }

        return {selectedNodeId, selectedNode, componentTreeExpendedKeys: [...componentTreeExpendedKeys]};
    },
    setPageConfig: pageConfig => ({pageConfig}),
    deleteSelectedNode: (_, state) => {
        return deleteNode(state.selectedNodeId, state);
    },
    deleteNode: (id, state) => {
        return deleteNode(id, state);
    },
    addNode: ({node, targetId, isBefore, isAfter, isChildren}, state) => {
        const {pageConfig} = state;

        if (pageConfig.componentName === 'DragHolder') {
            const {__config, ...others} = node;
            return {pageConfig: {...others, __config: {...__config}}};
        }

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

function getParentIds(data, id) {
    // 深度遍历查找
    function dfs(data, id, parents) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            // 找到id则返回父级id
            if (item.__config?.componentId === id) return parents;
            // children不存在或为空则不递归
            if (!item.children || !item.children.length) continue;
            // 往下查找时将当前id入栈
            parents.push(item.__config?.componentId);

            if (dfs(item.children, id, parents).length) return parents;
            // 深度遍历查找未找到时当前id 出栈
            parents.pop();
        }
        // 未找到时返回空数组
        return [];
    }

    return dfs(data, id, []);
}

function deleteNode(id, state) {
    let {pageConfig, selectedNodeId, selectedNode} = state;

    if (selectedNodeId === id) {
        selectedNodeId = null;
        selectedNode = null;
    }

    // 删除的是根节点
    if (id === pageConfig.__config.componentId) {
        return {pageConfig: {...holderNode}, selectedNodeId, selectedNode};
    }

    deleteNodeById(pageConfig, id);

    return {pageConfig: {...pageConfig}, selectedNodeId, selectedNode};
}
