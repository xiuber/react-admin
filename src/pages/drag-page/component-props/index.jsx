import React, {useRef, useEffect} from 'react';
import config from 'src/commons/config-hoc';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import FieldEditor from './field-editor';
import {useHeight} from 'ra-lib';
import {Button} from 'antd';
import {OTHER_HEIGHT} from 'src/pages/drag-page/util';
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
    const spaceRef = useRef(null);

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
        dragPageAction.refreshProps();
        dragPageAction.render();
    }

    // 设置组件列表底部站位高度
    useEffect(() => {
        if (!selectedNode) return;
        if (!rootRef.current) return;

        const elements = Array.from(document.querySelectorAll('#component-props > section'));

        if (!elements?.length) return;

        const element = elements[elements.length - 1];
        const elementRect = element.getBoundingClientRect();
        const {height} = elementRect;

        spaceRef.current.style.height = `calc(100% - ${height}px)`;

    }, [selectedNode, spaceRef.current, rootRef.current]);

    return (
        <div
            id="component-props"
            ref={rootRef}
            style={{
                position: 'relative',
                height,
                overflow: 'auto',
            }}
        >
            <FieldEditor
                fitHeight={!selectedNode?.wrapper?.length}
                dragPageAction={dragPageAction}
                rightSideWidth={rightSideWidth}
                selectedNode={selectedNode}
                refreshProps={refreshProps}
                onChange={(...args) => handleChange(selectedNode, ...args)}
            />
            {selectedNode?.wrapper?.length ? selectedNode.wrapper.map((node, index) => {
                return (
                    <section>
                        <FieldEditor
                            tip="相关："
                            tool={(
                                <Button
                                    style={{marginRight: 8}}
                                    type="text"
                                    danger
                                    onClick={() => handleDelete(index)}
                                >删除</Button>
                            )}
                            dragPageAction={dragPageAction}
                            rightSideWidth={rightSideWidth}
                            selectedNode={node}
                            refreshProps={refreshProps}
                            onChange={(...args) => handleChange(node, ...args)}
                        />
                    </section>
                );
            }) : null}
            <div ref={spaceRef}/>
        </div>
    );
});
