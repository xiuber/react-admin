import React, {createElement} from 'react';
import classNames from 'classnames';
import {getComponent, isComponentConfig} from '../../util';
import {getComponentDisplayName, getComponentConfig} from 'src/pages/drag-page/component-config';
import {cloneDeep} from 'lodash';
import styles from './style.less';

export default function NodeRender(props) {
    let {
        config,
        pageConfig,
        selectedNodeId,
        draggingNode,
        dragPageAction,
        // activeSideKey, // 左侧激活面板
        nodeSelectType, // 节点选中方式
        // iframeDocument,
        isPreview = true,
    } = props;

    if (!config) return null;

    if (typeof config !== 'object' || Array.isArray(config)) return config;

    let {
        wrapper,
        id: componentId,
        componentName,
        children,
        props: componentProps,
    } = config;

    if (!componentProps) componentProps = {};

    componentProps = cloneDeep(componentProps);

    if (!componentName) return null;

    const componentConfig = getComponentConfig(componentName);

    let {
        render,
        isContainer,
        draggable,
        componentDesc,
        withWrapper,
        wrapperStyle = {},
        actions = {},
        childrenDraggable,
        hooks = {},
        fields,
    } = componentConfig;

    const isRender = hooks.beforeRender && hooks.beforeRender({node: config});

    if (isRender === false) return null;
    if (render === false) return null;

    componentDesc = componentDesc || componentName;
    const componentDisplayName = getComponentDisplayName(config);
    const component = getComponent(config);

    // 处理属性
    if (fields?.length) {
        fields.filter(item => item.type === 'ReactNode').forEach(item => {
            const {field} = item;
            const propsConfig = componentProps[field];

            if (isComponentConfig(propsConfig)) {
                componentProps[field] = (
                    <NodeRender
                        {...props}
                        config={propsConfig}
                    />
                );
            }
        });
    }

    let childrenEle = children?.length ? children.map(item => {
        if (['Collapse.Panel', 'Tabs.TabPane'].includes(item.componentName)) {
            const Component = getComponent(item);
            isPreview = isPreview || !childrenDraggable;
            return (
                <Component {...item.props}>
                    {item.children.map(it => {
                        return (
                            <NodeRender
                                {...props}
                                config={it}
                                isPreview={isPreview}
                            />
                        );
                    })}
                </Component>
            );
        }

        return (
            <NodeRender
                {...props}
                config={item}
                isPreview={isPreview}
            />
        );
    }) : undefined;

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

    if (wrapper?.length) {
        wrapper = cloneDeep(wrapper);
        wrapper[wrapper.length - 1].children = [{...config, wrapper: null}];

        const nextConfig = wrapper.reduce((prev, wrapperConfig) => {
            wrapperConfig.children = [prev];

            return wrapperConfig;
        });

        return (
            <NodeRender
                {...props}
                config={nextConfig}
            />
        );
    }


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
        [styles.dragging]: draggingNode?.id === componentId,
        [styles.unDraggable]: !draggable,

        [`id_${componentId}`]: true,
    });

    const dragProps = {
        draggable,
        'data-componentDesc': componentDesc,
        'data-componentDisplayName': componentDisplayName,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
    };

    const onNodeClick = (e) => {

        if (nodeSelectType === 'meta') {
            if ((e.metaKey || e.ctrlKey)) {
                e.stopPropagation && e.stopPropagation();
                e.preventDefault && e.preventDefault();
                // 单纯选中节点，不进行其他操作
                dragPageAction.setSelectedNodeId(componentId);
            } else {
                propsActions.onClick && propsActions.onClick(e);
            }
        }

        // 单击模式
        if (nodeSelectType === 'click') {
            propsActions.onClick && propsActions.onClick(e);

            e.stopPropagation && e.stopPropagation();
            e.preventDefault && e.preventDefault();
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
            onClick: onNodeClick,
            children: [
                createElement(component, {
                    ...commonProps,
                    ...componentProps,
                    ...propsActions,
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

