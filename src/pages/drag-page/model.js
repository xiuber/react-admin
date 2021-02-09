import {
    findNodeById,
    findParentNodeById,
    findParentNodeByParentName,
    getAllNodesByName,
} from './util';
import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import {getComponentConfig, setComponentDefaultOptions} from './base-components';

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
    arrowLines: [
        {
            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            showEndPoint: false, // 显示结束点
        },
    ],
    showArrowLines: false,
    refreshArrowLines: null,
    activeToolKey: 'layout', // 头部激活 key
    selectedNodeId: null,
    selectedNode: null,
    nodeSelectType: 'click', // 画布上节点选中方式 click: 单击 or  meta: mate(ctrl) + 单击
    draggingNode: null, // 正在拖动的节点 key
    dragOverInfo: null, // 悬停节点信息
    showCode: false, // 显示代码
    // showSide: false, // 左侧是否显示
    showSide: true,
    // activeSideKey: null, // 左侧激活key
    activeSideKey: 'componentStore',
    // activeSideKey: 'schemaEditor',
    // activeTabKey: 'attribute', // 右侧激活tab key
    // activeTabKey: 'style', // 右侧激活tab key
    activeTabKey: 'props',

    componentTreeExpendedKeys: [], // 组件树 展开节点

    rightSideWidth: 385,
    schemaEditorWidth: 350,
    componentTreeWidth: 250,

    rightSideExpended: true,

    canvasWidth: '100%',
    canvasHeight: '100%',

    pageConfig: {...holderNode},
    iFrameDocument: null,
};

const syncStorage = {
    // rightSideWidth: true,
    schemaEditorWidth: true,
    componentTreeWidth: true,
    pageConfig: true,
    nodeSelectType: true,
};

export default {
    initialState,
    syncStorage,
    init: () => cloneDeep(initialState),
    setArrowLines: arrowLines => ({arrowLines}),
    setShowArrowLines: (showArrowLines, state) => {

        if(showArrowLines === undefined) return {showArrowLines: !state.showArrowLines}

        return {showArrowLines}
    },
    setRefreshArrowLines: refreshArrowLines => ({refreshArrowLines}),
    showDraggingArrowLine: (options, state) => {
        const {arrowLines = []} = state;
        const index = arrowLines.findIndex(item => item.dragging);

        if (index > -1) arrowLines.splice(index, 1);

        if (options) {
            options.dragging = true;
            arrowLines.push(options);
        }

        return {arrowLines: [...arrowLines]};
    },
    setNodeSelectType: nodeSelectType => ({nodeSelectType}),
    setIFrameDocument: iFrameDocument => ({iFrameDocument}),
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
    setNewProps: ({componentId, newProps = {}}, state) => {
        const {pageConfig} = state;

        const node = findNodeById(pageConfig, componentId);
        if (node) {
            if (!node.props) node.props = {};
            node.props = {
                ...node.props,
                ...newProps,
                key: uuid(), // 设置新key，保证组件重新渲染
            };
        }
        return {pageConfig: {...pageConfig}};
    },
    showModal: (componentId, state) => {
        const {pageConfig} = state;

        const node = findNodeById(pageConfig, componentId);
        if (node) {
            if (!node.props) node.props = {};
            node.props.visible = true;
        }

        return {pageConfig: {...pageConfig}};
    },
    syncFormItemLabelColFlex: ({node, flex}, state) => {
        const {pageConfig} = state;
        // 获取父级Form
        let formNode = findParentNodeByParentName(pageConfig, 'Form', node.__config.componentId);

        // 不存在，就从根节点开始
        if (!formNode) formNode = pageConfig;

        // 获取Form下所有的Form.Item
        const fromItems = getAllNodesByName(formNode, 'Form.Item');

        // 设置labelCol.flex
        fromItems.forEach(item => {
            if (!item.props) item.props = {};
            if (!item.props.labelCol) item.props.labelCol = {};
            item.props.labelCol.flex = flex;
        });
        return {pageConfig: {...pageConfig}};
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
    // 不要写这样的代码
    // 这样调用 dragPageAction.setSelectedNode({...selectedNode})
    // 会使 selectedNode 脱离 pageConfig 导致意外bug
    // setSelectedNode: selectedNode => ({selectedNode}),
    setSelectedNodeId: (selectedNodeId, state) => {
        let {pageConfig = []} = state;

        const selectedNode = findNodeById(pageConfig, selectedNodeId);

        if (selectedNode?.__config?.isRootHolder) {
            return {
                selectedNodeId: null,
                selectedNode: null,
            };
        }

        return {
            selectedNodeId,
            selectedNode,
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

        const pargs = {node: parentNode, targetNode: node, pageConfig};

        const res = beforeDeleteChildren && beforeDeleteChildren(pargs);

        if (res === false) return {pageConfig};


        deleteComponentById(pageConfig, id);

        // 添加占位符
        addDragHolder(parentNode);

        afterDelete && afterDelete(args);
        afterDeleteChildren && afterDeleteChildren({node: parentNode, targetNode: node});

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

        const args = {
            node: findNodeById(pageConfig, targetId),
            targetNode: node,
            pageConfig,
        };
        const res = beforeAdd && beforeAdd(args);
        if (res === false) return {pageConfig};

        // 添加占位符
        addDragHolder(node);

        const result = addOrMoveNode({
            isAdd: true,
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
            state,
        });

        if (afterAdd) afterAdd(args);

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

        const result = addOrMoveNode({
            isMove: true,
            pageConfig,
            isAfter,
            isBefore,
            isChildren,
            targetId,
            node,
            state,
        });

        afterMove && afterMove(args);

        return result;
    },
};


function addOrMoveNode(options) {
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
