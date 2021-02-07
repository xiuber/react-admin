import {findNodeById, findParentNodeById} from './util';
import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import {getComponentConfig, setComponentDefaultOptions} from './base-components';

const test = setComponentDefaultOptions(
    {
        componentName: 'PageContent',
        children: [
            {
                componentName: 'Form',
                children: [
                    {
                        componentName: 'Form.Item',
                        props: {
                            label: '姓名',
                        },
                        children: [
                            {
                                componentName: 'Input',
                                props: {
                                    placeholder: '请输入姓名',
                                },
                            },
                        ],
                    },
                    {
                        componentName: 'Form.Item',
                        props: {
                            label: '年龄',
                        },
                        children: [
                            {
                                componentName: 'InputNumber',
                                props: {
                                    style: {
                                        width: '100%',
                                    },
                                    placeholder: '请输入年龄',
                                },
                            },
                        ],
                    },
                    {
                        componentName: 'Button',
                        props: {
                            type: 'primary',
                            style: {
                                marginRight: 8,
                            },
                        },
                        children: [
                            {
                                componentName: 'Text',
                                props: {
                                    text: '保存',
                                    isDraggable: false,
                                },
                            },
                        ],
                    },
                    {
                        componentName: 'Button',
                        children: [
                            {
                                componentName: 'Text',
                                props: {
                                    text: '重置',
                                    isDraggable: false,
                                },
                            },
                        ],
                    },
                ],
            },
        ],
    },
);

const holderNode = test || {
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
                // className: 'grid-background',
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
    dragOverInfo: null, // 悬停节点信息
    showCode: false, // 显示代码
    // showSide: false, // 左侧是否显示
    showSide: true,
    // activeSideKey: null, // 左侧激活key
    activeSideKey: 'componentStore',
    // activeSideKey: 'schemaEditor',
    // activeTabKey: 'attribute', // 右侧激活tab key
    activeTabKey: 'style', // 右侧激活tab key

    componentTreeExpendedKeys: [], // 组件树 展开节点

    rightSideWidth: 385,
    schemaEditorWidth: 350,
    componentTreeWidth: 250,

    rightSideExpended: true,

    canvasWidth: '100%',
    canvasHeight: '100%',

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
    setDragOverInfo: dragOverInfo => ({dragOverInfo}),
    setCanvasWidth: canvasWidth => ({canvasWidth}),
    setCanvasHeight: canvasHeight => ({canvasHeight}),
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

        if (selectedNode?.__config?.isRootHolder) {
            return {
                selectedNodeId: null,
                selectedNode: null,
                componentTreeExpendedKeys: [...componentTreeExpendedKeys],
            };
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

    deleteNodeById: (id, state) => {
        let {pageConfig, selectedNodeId, selectedNode} = state;

        if (selectedNodeId === id) {
            selectedNodeId = null;
            selectedNode = null;
        }


        // 删除的是根节点
        if (id === pageConfig.__config.componentId) {
            return {pageConfig: {...holderNode}, selectedNodeId, selectedNode};
        }
        const node = findNodeById(pageConfig, id);

        if (!node) return {selectedNode: null, selectedNodeId: null};

        const parentNode = findParentNodeById(pageConfig, id);


        const {beforeDelete, afterDelete} = node.__config.hooks || {};

        const {beforeDeleteChildren, afterDeleteChildren} = parentNode?.__config?.hooks || {};

        const args = {node, pageConfig};
        const result = beforeDelete && beforeDelete(args);

        if (result === false) return {pageConfig};

        const pargs = {node: parentNode, pageConfig};

        const res = beforeDeleteChildren && beforeDeleteChildren(pargs);

        if (res === false) return {pageConfig};


        deleteComponentById(pageConfig, id);

        // 添加占位符
        addDragHolder(parentNode);

        afterDelete && afterDelete(args);
        afterDeleteChildren && afterDeleteChildren();

        return {pageConfig: {...pageConfig}, selectedNodeId, selectedNode};
    },
    addNode: (options, state) => {
        const {node, targetId, isBefore, isAfter, isChildren} = options;
        const {pageConfig} = state;

        // 拖拽节点 进行了 JSON.stringify, 会导致 actions hooks 函数丢失，重新设置一下
        const {componentId} = node.__config;
        node.__config = getComponentConfig(node);
        node.__config.componentId = componentId;

        const {beforeAdd, afterAdd} = node.__config.hooks || {};

        const res = beforeAdd && beforeAdd(options);
        if (res === false) return {pageConfig};


        // 添加占位符
        addDragHolder(node);

        const result = modifyPageConfig({
            isAdd: true,
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
        });

        if (afterAdd) afterAdd(options);

        return result;
    },
    moveNode: ({sourceId, targetId, isBefore, isAfter, isChildren}, state) => {
        const {pageConfig} = state;
        const sourceNode = findNodeById(pageConfig, sourceId);
        const {beforeMove, afterMove} = sourceNode.__config.hooks || {};

        const args = {
            node: sourceNode,
            pageConfig,
            targetId,
            targetNode: findNodeById(pageConfig, targetId),
        };

        const res = beforeMove && beforeMove(args);
        if (res === false) return {pageConfig};

        const parentNode = findParentNodeById(pageConfig, sourceId);

        const [node] = deleteComponentById(pageConfig, sourceId);

        // 添加占位符
        addDragHolder(parentNode);

        const result = modifyPageConfig({
            isMove: true,
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
        });

        afterMove && afterMove(args);

        return result;
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

        const {beforeAddChildren, afterAddChildren} = targetNode.__config.hooks || {};

        const args = {node: targetNode, targetNode: node, pageConfig};

        const res = beforeAddChildren && beforeAddChildren(args);
        if (res === false) return {pageConfig};

        targetNode.children.push(node);

        afterAddChildren && afterAddChildren(args);

        return {pageConfig: {...pageConfig}};
    }

    if (!targetCollection) return;

    if (isBefore) {
        const index = targetCollection.findIndex(item => item.__config?.componentId === targetId);
        targetCollection.splice(index, 0, node);
        return {pageConfig: {...pageConfig}};
    }

    if (isAfter) {
        const index = targetCollection.findIndex(item => item.__config?.componentId === targetId);
        targetCollection.splice(index + 1, 0, node);
        return {pageConfig: {...pageConfig}};
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
function deleteComponentById(root, id) {
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

// 添加占位符
function addDragHolder(node) {
    if (!node) return;

    const {children, __config: {isContainer, withHolder, holderProps}} = node;

    if (isContainer && withHolder && !children?.length) {
        node.children = [
            setComponentDefaultOptions({
                componentName: 'DragHolder',
                props: {...holderProps},
            }),
        ];
    }
}
