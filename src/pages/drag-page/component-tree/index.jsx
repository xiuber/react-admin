import React, { useState, useEffect, useRef } from 'react';
import { Tree } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import TreeNode from './TreeNode';
import { scrollElement } from '../util';
import Pane from '../pane';

import './style.less';
import DragBar from 'src/pages/drag-page/drag-bar';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNodeId: state.dragPage.selectedNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
            componentTreeWidth: state.dragPage.componentTreeWidth,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        componentTreeExpendedKeys,
        componentTreeWidth,
        action: { dragPage: dragPageAction },
    } = props;
    const [treeData, setTreeData] = useState([]);
    const [nodeCount, setNodeCount] = useState(0);
    const [allKeys, setAllKeys] = useState([]);
    const mainRef = useRef(null);

    useEffect(() => {
        if (!pageConfig) return;

        const treeData = {};
        let nodeCount = 0;
        const allKeys = [];
        const loop = (prev, next) => {
            const { __config = {}, componentName, children } = prev;
            const {
                componentId,
                componentDesc,
                isContainer = true,
                draggable = true,
            } = __config;
            next.title = componentDesc || componentName;
            next.isContainer = isContainer;
            next.key = componentId;
            next.draggable = draggable;
            next.nodeData = prev;

            allKeys.push(componentId);
            nodeCount++;

            if (children && children.length) {
                next.children = children.map(() => ({}));

                children.forEach((item, index) => {
                    loop(item, next.children[index]);
                });
            }
        };

        loop(pageConfig, treeData);

        setTreeData([treeData]);
        setNodeCount(nodeCount);
        setAllKeys(allKeys);

    }, [pageConfig]);

    function handleSelected([key]) {
        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData} />;
    }

    function handleExpand(keys) {
        dragPageAction.setComponentTreeExpendedKeys(keys);
    }

    useEffect(() => {
        dragPageAction.setComponentTreeExpendedKeys(allKeys);
    }, [selectedNodeId, allKeys]);
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

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{ marginRight: 4 }} />
                    组件树({nodeCount})
                </div>
            }
        >
            <div styleName="root" ref={mainRef} style={{width: componentTreeWidth}}>
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
                {/*<div style={{height: 1000, background: 'green'}}></div>*/}
            </div>
        </Pane>
    );
});
