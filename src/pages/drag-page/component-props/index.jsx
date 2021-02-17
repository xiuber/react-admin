import React, {useRef, useEffect, useState} from 'react';
import config from 'src/commons/config-hoc';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import FormEditor from './form-editor';
import {useHeight} from 'ra-lib';
import {Button} from 'antd';
import {OTHER_HEIGHT, scrollElement} from 'src/pages/drag-page/util';
import CodeEditor from 'src/pages/drag-page/component-props/code-editor';
// import {v4 as uuid} from 'uuid';

export default config({
    connect: state => {
        return {
            // 不可以引入 pageConfig
            // pageConfig: state.dragPage.pageConfig,
            refreshProps: state.dragPage.refreshProps,
            selectedNode: state.dragPage.selectedNode,
            rightSideWidth: state.dragPage.rightSideWidth,
        };
    },
})(function ComponentProps(props) {
    const {
        rightSideWidth,
        selectedNode,
        refreshProps,
        action: {dragPage: dragPageAction},
    } = props;
    const rootRef = useRef(null);
    const [editNode, setEditNode] = useState(null);
    const [editVisible, setEditVisible] = useState(false);

    const [height] = useHeight(rootRef, OTHER_HEIGHT);


    function handleChange(node, changedValues, allValues, replace) {
        if (!node?.componentName) return;

        if (!node?.props) node.props = {};

        if (replace) {
            node.props = allValues;
        } else {
            node.props = {
                ...node.props,
                ...allValues,
                // key: uuid(),
            };
        }

        // 清除空属性
        Object.entries(node.props)
            .forEach(([key, value]) => {
                if (value === undefined || value === '') {
                    Reflect.deleteProperty(node.props, key);
                }
            });

        const nodeConfig = getComponentConfig(node.componentName);

        const options = node.props.options || [];

        options.forEach(item => {
            Reflect.deleteProperty(item, '_form');
        });

        const afterPropsChange = nodeConfig?.hooks?.afterPropsChange;
        afterPropsChange && afterPropsChange({node: node, dragPageAction});

        console.log('props', JSON.stringify(node.props, null, 4));
        dragPageAction.render();
    }

    function handleDelete(index) {
        selectedNode.wrapper.splice(index, 1);
        dragPageAction.render(true);
    }

    function handleEdit(node) {
        setEditVisible(!editVisible);
        setEditNode(node);
    }

    // 编辑当前选中节点
    useEffect(() => {
        setEditNode(selectedNode);
    }, [selectedNode]);

    // 调整面板宽度
    useEffect(() => {
        if (editVisible && rightSideWidth < 440) {
            dragPageAction.setRightSideWidth(440);
        }
    }, [editVisible, rightSideWidth]);

    // 将属性面板滚动到顶部，并隐藏滚动条
    useEffect(() => {
        const rootEle = rootRef.current;

        if (!rootEle) return;
        if (!editNode) return;

        const editorRootEle = document.getElementById(`fieldEditor_${editNode.id}`);
        if (!editorRootEle) return;

        rootEle.style.overflow = editVisible ? 'hidden' : 'auto';

        scrollElement(rootEle, editorRootEle, true, true);

    }, [editVisible, editNode, rootRef.current]);

    return (
        <div style={{height: '100%', position: 'relative'}}>
            <CodeEditor
                onChange={values => handleChange(editNode, {}, values, true)}
                visible={editVisible}
                onCancel={() => setEditVisible(false)}
                selectedNode={editNode}
            />
            <div
                ref={rootRef}
                style={{height, overflow: 'auto'}}
            >
                <section id={`fieldEditor_${selectedNode?.id}`}>
                    <FormEditor
                        fitHeight={!selectedNode?.wrapper?.length}
                        dragPageAction={dragPageAction}
                        selectedNode={selectedNode}
                        onEdit={() => handleEdit(selectedNode)}
                        refreshProps={refreshProps}
                        onChange={(...args) => handleChange(selectedNode, ...args)}
                    />
                </section>
                {selectedNode?.wrapper?.length ? selectedNode.wrapper.map((node, index) => {
                    const isLast = index === selectedNode.wrapper.length - 1;
                    return (
                        <section id={`fieldEditor_${node.id}`} style={{height: isLast ? '100%' : 'auto'}}>
                            <FormEditor
                                tip="相关包裹："
                                tool={(
                                    <Button
                                        style={{marginRight: 8}}
                                        type="text"
                                        danger
                                        onClick={() => handleDelete(index)}
                                    >删除</Button>
                                )}
                                dragPageAction={dragPageAction}
                                selectedNode={node}
                                onEdit={() => handleEdit(node)}
                                refreshProps={refreshProps}
                                onChange={(...args) => handleChange(node, ...args)}
                            />
                        </section>
                    );
                }) : null}
            </div>
        </div>
    );
});
