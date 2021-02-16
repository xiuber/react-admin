import React, {useState, useEffect, useRef} from 'react';
import {Tree, Tooltip} from 'antd';
import {
    AppstoreOutlined,
    ShrinkOutlined,
    ArrowsAltOutlined,
} from '@ant-design/icons';
import classNames from 'classnames';
import {cloneDeep} from 'lodash';
import config from 'src/commons/config-hoc';
import TreeNode from './TreeNode';
import {
    scrollElement,
    getParentIds,
    isComponentConfig,
} from '../util';
import Pane from '../pane';
import {
    getComponentConfig,
    getComponentDisplayName,
} from 'src/pages/drag-page/component-config';

import './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
            selectedNodeId: state.dragPage.selectedNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
            refreshProps: state.dragPage.refreshProps,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        componentTreeExpendedKeys,
        draggingNode,
        refreshProps,
        action: {dragPage: dragPageAction},
    } = props;

    const [treeData, setTreeData] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [allKeys, setAllKeys] = useState([]);
    const [isAllExpanded, setIsAllExpanded] = useState(false);
    const mainRef = useRef(null);

    useEffect(() => {
        if (!pageConfig) return;

        const treeData = {};
        let nodeCount = 0;
        const allKeys = [];
        const loop = (prev, next, _draggable) => {
            const {id, props, wrapper, children, componentName} = prev;
            const componentConfig = getComponentConfig(componentName);
            let {
                isContainer,
                draggable,
                childrenDraggable,
            } = componentConfig;

            if (props?.isDraggable === false) {
                draggable = false;
            }

            next.title = ''; // 为了鼠标悬停，不显示原生 html title
            next.name = getComponentDisplayName(prev);
            next.isContainer = isContainer;
            next.key = id;
            next.id = id;
            next.draggable = _draggable !== undefined ? _draggable : draggable;
            next.nodeData = prev;

            allKeys.push(id);
            nodeCount++;

            if (children?.length) {
                next.children = children.map(() => ({}));

                const _d = _draggable === false ? false : childrenDraggable;

                children.forEach((item, index) => {
                    loop(item, next.children[index], _d);
                });
            }

            if (wrapper?.length) {
                if (!next.children) next.children = [];

                next.children.unshift({
                    key: `wrapper_${id}`,
                    id: `wrapper_${id}`,
                    title: '',
                    name: 'wrapper',
                    draggable: false,
                    isContainer: true,
                    nodeData: {},
                    children: cloneDeep(wrapper).map((w, index) => {
                        Reflect.deleteProperty(w, 'children');
                        const n = {};
                        loop(w, n);
                        return n;
                    }),
                });
            }
            Object.entries(props || {})
                .filter(([, value]) => isComponentConfig(value))
                .forEach(([field, value]) => {
                    if (!next.children) next.children = [];
                    const node = {};
                    loop(value, node);
                    node.name = `${field}: ${node.name}`;
                    next.children.unshift(node);
                });
        };

        loop(pageConfig, treeData);

        setTreeData([treeData]);
        setNodeCount(nodeCount);
        setAllKeys(allKeys);

    }, [pageConfig, refreshProps]);

    function handleSelected([key]) {
        if (!key) return;

        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData}/>;
    }

    function handleExpand(keys) {
        dragPageAction.setComponentTreeExpendedKeys(keys);
    }

    // 当有节点选中，展开对应父节点
    useEffect(() => {
        if (!treeData?.length) {
            dragPageAction.setComponentTreeExpendedKeys([]);
            return;
        }
        const keys = getParentIds(treeData[0], selectedNodeId) || [];
        // 去重
        const nextKeys = Array.from(new Set([...componentTreeExpendedKeys, ...keys, selectedNodeId]));

        dragPageAction.setComponentTreeExpendedKeys(nextKeys);
    }, [selectedNodeId, treeData]);

    // 当有节点选中，树滚动到相应位置
    useEffect(() => {
        const containerEle = mainRef.current;

        if (!containerEle) return;
        const element = containerEle.querySelector(`#treeNode_${selectedNodeId}`);

        if (element) return scrollElement(containerEle, element);

        // 等待树展开
        setTimeout(() => {
            const element = containerEle.querySelector(`#treeNode_${selectedNodeId}`);

            scrollElement(containerEle, element);
        }, 200);

    }, [selectedNodeId]);

    const styleName = classNames({
        root: true,
        hasDraggingNode: !!draggingNode,
    });

    return (
        <Pane
            header={
                <div styleName="header">
                    <div>
                        <AppstoreOutlined style={{marginRight: 4}}/>
                        组件树({nodeCount})
                    </div>
                    <div>
                        <Tooltip placement="top" title={isAllExpanded ? '收起所有' : '展开所有'}>
                            <div
                                styleName="tool"
                                onClick={() => {
                                    const nextKeys = isAllExpanded ? [] : allKeys;
                                    dragPageAction.setComponentTreeExpendedKeys(nextKeys);
                                    setIsAllExpanded(!isAllExpanded);
                                }}
                            >
                                {isAllExpanded ? <ShrinkOutlined/> : <ArrowsAltOutlined/>}
                            </div>
                        </Tooltip>
                    </div>
                </div>
            }
        >
            <div
                styleName={styleName}
                ref={mainRef}
            >
                <Tree
                    expandedKeys={componentTreeExpendedKeys}
                    onExpand={handleExpand}
                    blockNode

                    draggable
                    treeData={treeData}
                    titleRender={renderNode}

                    selectable
                    selectedKeys={[selectedNodeId]}
                    onSelect={handleSelected}
                />
            </div>
        </Pane>
    );
});
