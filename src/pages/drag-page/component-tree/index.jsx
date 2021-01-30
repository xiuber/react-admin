import React, {useState, useEffect, useRef} from 'react';
import {Tree} from 'antd';
import {
    AppstoreOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';

import {v4 as uuid} from 'uuid';
import {getDropGuidePosition} from '../util';

import './style.less';

const TreeNode = config({
    connect: state => {
        return {
            draggingNodeId: state.dragPage.draggingNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
        };
    },
})(function TreeNode(props) {
    const {
        node,
        selectedKey,
        draggingNodeId,
        componentTreeExpendedKeys,
        action: {dragPage: dragPageAction},
    } = props;
    const {key, title, isContainer, draggable} = node;

    const hoverRef = useRef(0);
    const nodeRef = useRef(null);
    const [dragIn, setDragIn] = useState(false);
    const [dropPosition, setDropPosition] = useState('');

    function handleDragStart(e) {
        e.stopPropagation();

        dragPageAction.setDraggingNodeId(key);

        e.dataTransfer.setData('sourceComponentId', key);
    }

    function handleDragEnter(e) {
        if (draggingNodeId === key) return;
        setDragIn(true);
    }

    function handleDragOver(e) {
        if (draggingNodeId === key) return;

        // 1s 后展开节点
        if (!hoverRef.current) {
            hoverRef.current = setTimeout(() => {
                if (!componentTreeExpendedKeys.some(k => k === key)) {
                    dragPageAction.setComponentTreeExpendedKeys([...componentTreeExpendedKeys, key]);
                }
            }, 500);
        }
        const options = getDropGuidePosition({
            event: e,
            targetElement: e.target,
            isContainer,
            isInFrame: false,
            triggerSize: 10,
        });
        const {isTop, isBottom, isCenter} = options;

        if (isTop) setDropPosition('top');
        if (isBottom) setDropPosition('bottom');
        if (isCenter) setDropPosition('center');
    }

    function handleDragLeave(e) {
        setDragIn(false);

        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
        let componentConfig = e.dataTransfer.getData('componentConfig');

        if (key === sourceComponentId) return;

        const options = getDropGuidePosition({
            event: e,
            targetElement: e.target,
            isContainer,
            isInFrame: false,
            triggerSize: 10,
        });
        const {isTop, isBottom, isCenter} = options;

        if (sourceComponentId) {
            dragPageAction.moveNode({
                sourceId: sourceComponentId,
                targetId: key,
                isBefore: isTop,
                isAfter: isBottom,
                isChildren: isCenter,
            });
            dragPageAction.setSelectedNodeId(sourceComponentId);
        }

        if (componentConfig) {
            componentConfig = JSON.parse(componentConfig);
            dragPageAction.addNode({
                targetId: key,
                isBefore: isTop,
                isAfter: isBottom,
                isChildren: isCenter,
                node: componentConfig,
            });
            dragPageAction.setSelectedNodeId(componentConfig.__config?.componentId);
        }

        handleDragLeave(e);
        handleDragEnd();
    }

    function handleDragEnd() {
        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
        dragPageAction.setDraggingNodeId(null);
    }

    const isSelected = selectedKey === key;
    const isDragging = draggingNodeId === key;
    const styleNames = ['treeNode'];


    if (isSelected) styleNames.push('selected');
    if (isDragging) styleNames.push('dragging');
    if (dragIn && draggingNodeId) styleNames.push('dragIn');

    styleNames.push(dropPosition);


    // styleNames.push('dragIn');
    // styleNames.push('top');

    const positionMap = {
        top: '前',
        bottom: '后',
        center: '内',
    };
    return (
        <div
            ref={nodeRef}
            key={key}
            styleName={styleNames.join(' ')}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
        >
            {title}
            <div styleName="dragGuide" style={{display: dragIn && draggingNodeId ? 'flex' : 'none'}}>
                <span>{positionMap[dropPosition]}</span>
            </div>
        </div>
    );
});

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNodeId: state.dragPage.selectedNodeId,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
        };
    },
})(function ComponentTree(props) {
    const {
        pageConfig,
        selectedNodeId,
        componentTreeExpendedKeys,
        action: {dragPage: dragPageAction},
    } = props;
    const [treeData, setTreeData] = useState([{key: 1, title: 1}]);

    useEffect(() => {
        if (!pageConfig) return;

        const treeData = {};
        const loop = (prev, next) => {
            const {__config = {}, componentName, children} = prev;
            const {
                isRoot,
                componentId,
                componentDesc,
                isContainer,
                draggable = true,
            } = __config;
            next.title = componentDesc || componentName;
            next.isContainer = isContainer;
            next.key = componentId;
            next.draggable = draggable;
            if (isRoot) next.draggable = false;

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

    function handleSelected([key]) {
        dragPageAction.setSelectedNodeId(key);
    }

    function renderNode(nodeData) {

        return <TreeNode selectedKey={selectedNodeId} node={nodeData}/>;
    }

    function handleExpand(keys) {
        dragPageAction.setComponentTreeExpendedKeys(keys);
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
                                children: [
                                    {
                                        __config: {
                                            componentId: uuid(),
                                        },
                                        componentName: 'Text',
                                        text: componentId,
                                    },
                                ],
                            };
                            e.dataTransfer.setData('componentConfig', JSON.stringify(config));
                            dragPageAction.setDraggingNodeId(componentId);
                        }
                    }
                >
                    啥的呢
                </div>
            </main>
        </PageContent>
    );
});
