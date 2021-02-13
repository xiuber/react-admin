import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {
    findNodeById,
    findParentNodeById,
    findParentNodeByParentName,
    getAllNodesByName,
    syncObject,
} from './util';

const rootHolderNode = () => (
    {
        id: uuid(),
        componentName: 'RootDragHolder',
    }
);

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
    contentEditable: true,
    showArrowLines: false,
    refreshArrowLines: null,
    refreshProps: null,
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

    pageConfig: rootHolderNode(),
    iframeDocument: null,
};

const syncStorage = {
    // rightSideWidth: true,
    schemaEditorWidth: true,
    componentTreeWidth: true,
    contentEditable: true,
    nodeSelectType: true,

    pageConfig: true,

};

export default {
    initialState,
    syncStorage,
    init: () => cloneDeep(initialState),
    setContentEditable: contentEditable => ({contentEditable}),
    setArrowLines: arrowLines => ({arrowLines}),
    setShowArrowLines: (showArrowLines, state) => {

        if (showArrowLines === undefined) return {showArrowLines: !state.showArrowLines};

        return {showArrowLines};
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
    setIFrameDocument: iframeDocument => ({iframeDocument}),
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
                // key: uuid(), // 设置新key，保证组件重新创建
            };
        }
        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    showModal: (componentId, state) => {
        const {pageConfig} = state;

        const node = findNodeById(pageConfig, componentId);
        if (node) {
            if (!node.props) node.props = {};
            node.props.visible = true;
        }

        return {pageConfig: {...pageConfig}, refreshProps: {}};
    },
    syncOffspringProps: (options, state) => {
        const {pageConfig} = state;

        const {
            node, // 当前
            ancestorComponentName, // 祖先
            props, // 要同步的属性
        } = options;
        const {componentName} = node;

        // 祖先节点
        let ancestorNode = findParentNodeByParentName(pageConfig, ancestorComponentName, node.id);

        // 不存在，就从根节点开始
        if (!ancestorNode) ancestorNode = pageConfig;

        // 获取祖先下所有同名节点
        const nodes = getAllNodesByName(ancestorNode, componentName);

        // 设置新属性
        nodes.forEach(item => {
            if (!item.props) item.props = {};
            syncObject(item.props, props);
        });

        return {pageConfig: {...pageConfig}};
    },
    syncFormItemLabelColFlex: ({node, flex}, state) => {
        const {pageConfig} = state;
        // 获取父级Form
        let formNode = findParentNodeByParentName(pageConfig, 'Form', node.id);

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

        if (selectedNode?.componentName === 'RootDragHolder') {
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
    refreshProps: () => ({refreshProps: {}}),
    setPageConfig: pageConfig => {
        if (!pageConfig) {
            return {pageConfig: rootHolderNode()};
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
        if (id === pageConfig.id) {
            return {pageConfig: rootHolderNode(), selectedNodeId, selectedNode};
        }

        const node = findNodeById(pageConfig, id);

        if (!node) return {selectedNode: null, selectedNodeId: null};
        const nodeConfig = getComponentConfig(node.componentName);

        const parentNode = findParentNodeById(pageConfig, id);
        const parentNodeConfig = getComponentConfig(parentNode.componentName);

        const {beforeDelete, afterDelete} = nodeConfig.hooks || {};

        const {beforeDeleteChildren, afterDeleteChildren} = parentNodeConfig.hooks || {};

        const args = {node, targetNode: parentNode, pageConfig};
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
    addWrapper: (options, state) => {
        const {pageConfig} = state;
        const {node, targetId} = options;

        // 新增节点，添加id
        const loopId = n => {
            n.id = uuid();
            if (n.children?.length) {
                n.children.forEach(i => loopId(i));
            }
        };
        loopId(node);

        const targetNode = findNodeById(pageConfig, targetId);
        if (!targetNode?.wrapper?.length) targetNode.wrapper = [];
        targetNode.wrapper.push(node);

        return {pageConfig: {...pageConfig}};
    },
    addNode: (options, state) => {
        const {node, targetId, isBefore, isAfter, isChildren} = options;
        const {pageConfig} = state;

        // 拖拽节点 进行了 JSON.stringify, 会导致 actions hooks 函数丢失，重新设置一下
        const componentConfig = getComponentConfig(node.componentName);

        const {beforeAdd, afterAdd} = componentConfig.hooks || {};

        const args = {
            node,
            targetNode: isChildren ? findNodeById(pageConfig, targetId) : findParentNodeById(pageConfig, targetId),
            pageConfig,
        };
        const res = beforeAdd && beforeAdd(args);
        if (res === false) return {pageConfig};

        // 添加占位符
        addDragHolder(node);

        // 新增节点，添加id
        const loopId = n => {
            n.id = uuid();
            if (n.children?.length) {
                n.children.forEach(i => loopId(i));
            }
        };
        loopId(node);

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
        const sourceNodeConfig = getComponentConfig(sourceNode.componentName);
        const {beforeMove, afterMove} = sourceNodeConfig.hooks || {};

        const args = {
            node: sourceNode,
            pageConfig,
            targetId,
            targetNode: isChildren ? findNodeById(pageConfig, targetId) : findParentNodeById(pageConfig, targetId),
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
    if (targetNode.componentName === 'RootDragHolder') {
        return {pageConfig: {...node}};
    }

    if (isChildren) {
        // 目标节点为空
        if (
            !targetNode.children
            || (targetNode.children?.length === 1 && targetNode.children[0].componentName === 'DragHolder')
        ) targetNode.children = [];

        const targetNodeConfig = getComponentConfig(targetNode.componentName);

        const {beforeAddChildren, afterAddChildren} = targetNodeConfig.hooks || {};

        const args = {node: targetNode, targetNode: node, pageConfig};

        const res = beforeAddChildren && beforeAddChildren(args);
        if (res === false) return {pageConfig};

        targetNode.children.push(node);

        afterAddChildren && afterAddChildren(args);

        return {pageConfig: {...pageConfig}};
    }

    if (!targetCollection) return;

    if (isBefore) {
        const index = targetCollection.findIndex(item => item.id === targetId);
        targetCollection.splice(index, 0, node);
        return {pageConfig: {...pageConfig}};
    }

    if (isAfter) {
        const index = targetCollection.findIndex(item => item.id === targetId);
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
    if (root.id === id) return null;

    if (!root.children) return null;

    if (root.children.some(item => item.id === id)) {
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
            if (node?.id === id) {
                const index = nodes.findIndex(item => item?.id === id);
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

    const {componentName, children} = node;
    const nodeConfig = getComponentConfig(componentName);
    const {isContainer, withHolder, holderProps} = nodeConfig;

    if (isContainer && withHolder && !children?.length) {
        node.children = [
            {
                id: uuid(),
                componentName: 'DragHolder',
                props: {...holderProps},
            },
        ];
    }
}
