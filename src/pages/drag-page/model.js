import {findNodeById} from './util';
import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import {getComponentConfig} from './base-components';

const holderNode = {
    __config: {
        draggable: false,
        componentId: uuid(),
        isRootHolder: true,
    },
    componentName: 'div',
    children: [
        {
            __config: {
                componentId: uuid(),
                isContainer: false,
                isRootHolder: true,
            },
            componentName: 'DragHolder',
            props: {
                style: {
                    height: 'calc(100vh - 2px)',
                    fontSize: 18,
                },
            },
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
    // activeTabKey: 'attribute', // 右侧激活tab key
    activeTabKey: 'style', // 右侧激活tab key

    componentTreeExpendedKeys: [], // 组件树 展开节点

    rightSideWidth: 330,
    schemaEditorWidth: 350,
    componentTreeWidth: 250,

    rightSideExpended: true,

    pageConfig: {...holderNode},
};

const syncStorage = {
    // rightSideWidth: true,
    schemaEditorWidth: true,
    componentTreeWidth: true,
};

export default {
    initialState,
    syncStorage,
    init: () => cloneDeep(initialState),
    setRightSideExpended: rightSideExpended => ({rightSideExpended}),
    setComponentTreeWidth: componentTreeWidth => ({componentTreeWidth}),
    setSchemaEditorWidth: schemaEditorWidth => ({schemaEditorWidth}),
    setRightSideWidth: rightSideWidth => ({rightSideWidth}),
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

        const parentKeys = getParentIds(pageConfig, selectedNodeId);
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
    render: (_, state) => {
        const {pageConfig} = state;

        return {pageConfig: {...pageConfig}};
    },
    setPageConfig: pageConfig => {
        if (!pageConfig) {
            return {pageConfig: {...holderNode}};
        }

        return {pageConfig};
    },

    // TODO 删除后，选中下一个？？
    deleteSelectedNode: (_, state) => {
        return deleteNode(state.selectedNodeId, state);
    },
    deleteNode: (id, state) => {
        return deleteNode(id, state);
    },
    addNode: ({node, targetId, isBefore, isAfter, isChildren}, state) => {
        const {pageConfig} = state;


        // 拖拽节点 进行了 JSON.stringify, 会导致 actions 函数丢失
        const defaultConfig = getComponentConfig(node.componentName);
        node.__config.actions = defaultConfig.actions;

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

    // 目标节点为 根占位
    if (targetNode?.__config?.isRootHolder) {
        return {pageConfig: {...node}};
    }

    if (isChildren) {
        // 目标节点为空
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

/**
 * 获取id节点所在集合
 * @param root
 * @param id
 * @returns {*|null}
 */
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

/**
 * 根据id 删除 root 中节点，并返回删除节点
 * @param root
 * @param id
 * @returns {any} 被删除的节点
 */
function deleteNodeById(root, id) {
    const dataSource = Array.isArray(root) ? root : [root];

    let deletedNode = undefined;
    const loop = nodes => {
        for (const node of nodes) {
            if (node?.__config?.componentId === id) {
                const index = nodes.findIndex(item => item?.__config?.componentId === id);
                deletedNode = nodes.splice(index, 1);
                return;
            } else {
                if (node?.children?.length) {
                    loop(node.children);
                }
            }
        }
    };

    loop(dataSource);

    return deletedNode;
}


/**
 * 获取 id 对应的所有祖先节点
 * @param root
 * @param id
 * @returns {*|[]}
 */
function getParentIds(root, id) {
    const data = Array.isArray(root) ? root : [root];

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
