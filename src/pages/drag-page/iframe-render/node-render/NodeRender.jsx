import React, {createElement} from 'react';
import classNames from 'classnames';
import {getComponent} from '../../util';
import {getComponentDisplayName} from 'src/pages/drag-page/base-components';
import styles from './style.less';

export default function NodeRenderDraggable(props) {
    const {
        config,
        pageConfig,
        selectedNodeId,
        draggingNode,
        dragPageAction,
        activeSideKey, // 左侧激活面板
        nodeSelectType, // 节点选中方式
        iframeDocument,
        isPreview = true,
    } = props;

    if (!config) return null;

    if (typeof config !== 'object' || Array.isArray(config)) return config;

    let {
        __config: {
            isContainer,
            draggable,
            componentId,
            componentType,
            componentDesc,
            withWrapper,
            wrapperStyle = {},
            actions = {},
            childrenDraggable,
        },
        componentName,
        children,
        props: componentProps,
    } = config;

    if (!componentProps) componentProps = {};

    if (!componentName) return null;

    componentDesc = componentDesc || componentName;
    const componentDisplayName = getComponentDisplayName(config);

    let childrenEle = children?.length ? children.map(item => {

        return (
            <NodeRenderDraggable
                config={item}
                pageConfig={pageConfig}
                draggingNode={draggingNode}
                selectedNodeId={selectedNodeId}
                dragPageAction={dragPageAction}
                activeSideKey={activeSideKey}
                isPreview={isPreview || !childrenDraggable}
                nodeSelectType={nodeSelectType}
                iframeDocument={iframeDocument}
            />
        );
    }) : undefined;


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


    const propsActions = {};
    ['onClick'].forEach(key => {
        const value = componentProps[key];
        if (typeof value === 'string') {
            // eslint-disable-next-line
            propsActions[key] = eval(value);
        }
    });

    const commonProps = {
        children: childrenEle,
        ...componentActions,
    };

    if (isPreview) {
        return createElement(component, {
            ...commonProps,
            ...componentProps,
            ...propsActions,
        });
    }

    const dragClassName = classNames({
        [styles.draggableElement]: true,
        [styles.selected]: selectedNodeId === componentId,
        [styles.dragging]: draggingNode?.__config?.componentId === componentId,
        [styles.unDraggable]: !draggable,

    });

    const dragProps = {
        draggable,
        'data-componentDesc': componentDesc,
        'data-componentDisplayName': componentDisplayName,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
    };

    const onNodeClick = (e) => {
        e.stopPropagation && e.stopPropagation();
        e.preventDefault && e.preventDefault();

        if (nodeSelectType === 'meta') {
            if ((e.metaKey || e.ctrlKey)) {
                // 单纯选中节点，不进行其他操作
                dragPageAction.setSelectedNodeId(componentId);
            } else {
                propsActions.onClick && propsActions.onClick(e);
            }
        }

        // 单击模式
        if (nodeSelectType === 'click') {
            propsActions.onClick && propsActions.onClick(e);
            dragPageAction.setSelectedNodeId(componentId);
        }
    };

    if (withWrapper) {
        let {style = {}} = componentProps;
        const wStyle = {...wrapperStyle};

        style = {...style}; // 浅拷贝一份 有可能会修改

        // 同步到 wrapper 的样式
        const syncTopWStyle = [
            'display',
            'width',
            'height',
        ];

        // 移动到 wrapper上的样式
        const removeTopWStyle = [
            'marginTop',
            'marginRight',
            'marginBottom',
            'marginLeft',
        ];

        syncTopWStyle.forEach(key => {
            if (!(key in style)) return;

            wStyle[key] = style[key];
        });

        removeTopWStyle.forEach(key => {
            if (!(key in style)) return;

            wStyle[key] = style[key];
            style[key] = undefined;
        });

        return createElement('div', {
            ...dragProps,
            className: dragClassName + ' dragWrapper',
            style: wStyle,
            children: [
                createElement(component, {
                    ...commonProps,
                    ...componentProps,
                    ...propsActions,
                    onClick: onNodeClick,
                    style,
                }),
            ],
        });
    }

    return createElement(component, {
        ...commonProps,
        ...componentProps,
        ...propsActions,
        ...dragProps,
        className: [dragClassName, componentProps.className].join(' '),
        onClick: onNodeClick,
    });
}

