import {findNodeById} from './util';
import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';

const holderNode = {
    __config: {
        draggable: false,
        componentId: uuid(),
    },
    componentName: 'div',
    children: [
        {
            __config: {
                componentId: uuid(),
            },
            componentName: 'DragHolder',
        },
    ],
};

const initialState = {
    activeToolKey: 'layout', // 头部激活 key
    selectedNodeId: null,
    selectedNode: null,
    draggingNode: null, // 正在拖动的节点 key
    showCode: false, // 显示代码
    // showSide: false, // 左侧是否显示
    showSide: true,
    // activeSideKey: null, // 左侧激活key
    activeSideKey: 'componentStore',
    // activeSideKey: 'schemaEditor',
    activeTabKey: 'attribute', // 右侧激活tab key

    componentTreeExpendedKeys: [], // 组件树 展开节点

    pageConfig: {...holderNode},
};

export default {
    initialState,
    init: () => cloneDeep(initialState),
    setComponentTreeExpendedKeys: componentTreeExpendedKeys => ({componentTreeExpendedKeys}),
    setDraggingNode: draggingNode => ({draggingNode}),
    setActiveTabKey: activeTabKey => {
        return {activeTabKey};
    },
    setActiveSideKey: (activeSideKey) => {
        if (!activeSideKey) return {activeSideKey, showSide: false};

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

        return {
            selectedNodeId,
            selectedNode,
            componentTreeExpendedKeys: [...componentTreeExpendedKeys],
        };
    },
    setPageConfig: pageConfig => {
        if (!pageConfig) {
            return {pageConfig: {...holderNode}};
        }

        return {pageConfig};
    },
    deleteSelectedNode: (_, state) => {
        return deleteNode(state.selectedNodeId, state);
    },
    deleteNode: (id, state) => {
        return deleteNode(id, state);
    },
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
        if (
            !targetNode.children
            || (targetNode.children?.length === 1 && targetNode.children[0].componentName === 'DragHolder')
        ) targetNode.children = [];

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
