import React, {useState, useEffect, useRef} from 'react';
import {Tree} from 'antd';
import {
    AppstoreOutlined,
} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import {v4 as uuid} from 'uuid';
import TreeNode from './TreeNode';
import {scrollElement} from '../util';

import './style.less';

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
    const mainRef = useRef(null);

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
            next.nodeData = prev;

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

    return (
        <PageContent fitHeight otherHeight={8} styleName="root">
            <header>
                <span>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件树
                </span>
            </header>
            <main ref={mainRef}>
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
                            dragPageAction.setDraggingNode(config);
                        }
                    }
                >
                    啥的呢
                </div>
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
            </main>
        </PageContent>
    );
});
