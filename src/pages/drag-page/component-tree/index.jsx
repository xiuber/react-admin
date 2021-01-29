import React, {useState, useEffect, useRef} from 'react';
import {Tree} from 'antd';
import {
    AppstoreOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import styles from './style.less';
import {v4 as uuid} from 'uuid';

const TreeNode = config({
    connect: state => {
        return {
            draggingNodeId: state.dragPage.draggingNodeId,
        };
    },
})(function TreeNode(props) {
    const {node, selectedKey, draggingNodeId, action: {dragPage: dragPageAction}} = props;
    const {key, title} = node;

    function handleDragStart(e) {
        e.stopPropagation();

        console.log(key);
        dragPageAction.setDraggingNodeId(key);

        e.dataTransfer.setData('sourceComponentId', key);
    }

    function handleDragEnd() {
        dragPageAction.setDraggingNodeId(null);
    }

    const isSelected = selectedKey === key;
    const isDragging = draggingNodeId === key;
    const styleNames = ['treeNode'];

    if (isSelected) styleNames.push('selected');
    if (isDragging) styleNames.push('dragging');

    return (
        <div
            key={key}
            styleName={styleNames.join(' ')}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {title}
        </div>
    );
});

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNodeId: state.dragPage.selectedNodeId,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        action: {dragPage: dragPageAction},
    } = props;
    const [treeData, setTreeData] = useState([{key: 1, title: 1}]);

    useEffect(() => {
        if (!pageConfig) return;

        const treeData = {};

        const loop = (prev, next) => {
            const {__config = {}, componentName, children} = prev;
            const {componentId, componentDesc} = __config;
            next.title = componentDesc || componentName;
            next.title = (componentDesc || componentName) + componentId;
            next.key = componentId;


            if (children && children.length) {
                next.children = children.map(() => ({}));

                children.forEach((item, index) => {
                    loop(item, next.children[index]);
                });
            }
        };

        loop(pageConfig, treeData);

        setTreeData([treeData]);

    }, [pageConfig]);

    function handleDragStart({event, node}) {
        event.dataTransfer.setData('sourceComponentId', node.key);
    }

    function handleDragEnter(info) {
        console.log(info);
    }

    function handleDrop(info) {
        // console.log(info);
        const {event, node} = info;
        const sourceId = event.dataTransfer.getData('sourceComponentId');
        let componentConfig = event.dataTransfer.getData('componentConfig');

        let targetId = info.node.key;
        let isBefore;
        let isAfter;
        let isChildren;

        const dropPos = info.node.pos.split('-');
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

        if (!info.dropToGap) {
            // 放入节点内
            // isChildren = true;
            if (node.children?.length) {
                targetId = node.children[0].key;
                isBefore = true;
            }

        } else if (
            (info.node.props.children || []).length > 0 && // Has children
            info.node.props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            isBefore = true;
        } else {
            isAfter = true;
        }
        if (sourceId) {
            dragPageAction.moveNode({
                sourceId,
                targetId,
                isBefore,
                isAfter,
                isChildren,
            });
        }
        if (componentConfig) {
            dragPageAction.addNode({
                node: JSON.parse(componentConfig),
                targetId,
                isBefore,
                isAfter,
                isChildren,
            });
        }
    }

    function handleSelected([key]) {
        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData}/>;
    }

    return (
        <PageContent fitHeight styleName="root">
            <header>
                <span>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件树
                </span>
            </header>
            <main>
                <Tree
                    className="draggable-tree"
                    autoExpandParent
                    // defaultExpandedKeys={this.state.expandedKeys}
                    draggable
                    blockNode
                    onDragStart={handleDragStart}
                    onDragEnter={handleDragEnter}
                    onDrop={handleDrop}

                    treeData={treeData}
                    titleRender={renderNode}

                    selectable
                    selectedKeys={[selectedNodeId]}
                    onSelect={handleSelected}
                />
                <div
                    style={{width: 100, height: 100, background: 'red'}}
                    draggable
                    onDragStart={
                        function(e) {
                            e.stopPropagation();
                            const componentId = uuid();
                            const config = {
                                __config: {
                                    componentId,
                                    isContainer: true,
                                },
                                componentName: 'div',
                                style: {height: 50, background: 'grey', border: '1px solid #fff', padding: 16},
                                children: [componentId],
                            };
                            e.dataTransfer.setData('componentConfig', JSON.stringify(config));
                        }
                    }
                >
                    啥的呢
                </div>
            </main>
        </PageContent>
    );
});
