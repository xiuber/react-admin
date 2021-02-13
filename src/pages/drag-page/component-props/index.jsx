import React, {useRef} from 'react';
import config from 'src/commons/config-hoc';

import {getComponentConfig} from 'src/pages/drag-page/component-config';
import FieldEditor from './field-editor';
import {useHeight} from 'ra-lib';

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

    const [height] = useHeight(rootRef);


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

        const options = node.props.options || [];

        options.forEach(item => {
            Reflect.deleteProperty(item, '_form');
        });

        const nodeConfig = getComponentConfig(node.componentName);
        const afterPropsChange = nodeConfig?.hooks?.afterPropsChange;
        afterPropsChange && afterPropsChange({node: node});

        console.log('props', JSON.stringify(node.props, null, 4));
        dragPageAction.render();
    }

    console.log(selectedNode?.wrapper);
    return (
        <div
            ref={rootRef}
            style={{
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
            {selectedNode?.wrapper?.length ? selectedNode?.wrapper.map(node => {
                return (
                    <FieldEditor
                        tip="相关："
                        dragPageAction={dragPageAction}
                        rightSideWidth={rightSideWidth}
                        selectedNode={node}
                        refreshProps={refreshProps}
                        onChange={(...args) => handleChange(node, ...args)}
                    />
                );
            }) : null}
        </div>
    );
});
