import React, {useState, useEffect, useRef} from 'react';
import {Tree, Tooltip} from 'antd';
import {
    AppstoreOutlined,
    ShrinkOutlined,
    ArrowsAltOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import TreeNode from './TreeNode';
import {scrollElement, getParentIds} from '../util';
import Pane from '../pane';
import classNames from 'classnames';
import DragBar from 'src/pages/drag-page/drag-bar';
import {getComponentConfig, getComponentDisplayName} from 'src/pages/drag-page/component-config';

import './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
            selectedNodeId: state.dragPage.selectedNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
            componentTreeWidth: state.dragPage.componentTreeWidth,
            refreshProps: state.dragPage.refreshProps,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        componentTreeExpendedKeys,
        componentTreeWidth,
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
                    title: '',
                    name: 'wrapper',
                    draggable: false,
                    nodeData: {},
                    children: wrapper.map(w => {
                        Reflect.deleteProperty(w, 'children');
                        const n = {};
                        loop(w, n);
                        return n;
                    }),
                });
            }
        };

        loop(pageConfig, treeData);

        setTreeData([treeData]);
        setNodeCount(nodeCount);
        setAllKeys(allKeys);

    }, [pageConfig, refreshProps]);

    function handleSelected([key]) {
        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData}/>;
    }

    function handleExpand(keys) {
        dragPageAction.setComponentTreeExpendedKeys(keys);
    }

    useEffect(() => {
        const keys = getParentIds(pageConfig, selectedNodeId) || [];
        // 去重
        const nextKeys = Array.from(new Set([...componentTreeExpendedKeys, ...keys, selectedNodeId]));

        dragPageAction.setComponentTreeExpendedKeys(nextKeys);
    }, [selectedNodeId]);

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

    function handleDragging(info) {
        const {clientX} = info;

        dragPageAction.setComponentTreeWidth(clientX - 56);
    }

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
                style={{width: componentTreeWidth}}
            >
                <DragBar onDragging={handleDragging}/>
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
