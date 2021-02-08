import React, {createElement} from 'react';
import {getComponent} from 'src/pages/drag-page/util';

export default function NodeRender(props) {
    const {
        config = {},
        pageConfig,
        dragPageAction,
        iframeDocument = window.document,
    } = props;

    const {componentName, children, props: componentProps} = config;

    if (!componentName || componentName === 'DragHolder') return null;

    const {componentType, actions = {}} = config.__config || {};

    const childrenElement = children?.length ? children.map(item => (
        <NodeRender
            config={item}
            pageConfig={pageConfig}
            dragPageAction={dragPageAction}
            iframeDocument={iframeDocument}
        />)) : undefined;

    const component = getComponent(componentName, componentType);

    const componentActions = Object.entries(actions)
        .reduce((prev, curr) => {
            const [key, value] = curr;
            prev[key] = (...args) => value(...args)({
                pageConfig,
                dragPageAction,
                node: config,
            });
            return prev;
        }, {});

    const commonProps = {
        getPopupContainer: () => iframeDocument.body,
    };

    return createElement(component, {
        ...commonProps,
        ...componentProps,
        ...componentActions,
        children: childrenElement,
    });
}
