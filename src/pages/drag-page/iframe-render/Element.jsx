import React, {createElement, useRef, useEffect} from 'react';
import styles from './style.less';
import {
    getDropGuidePosition,
    isDropAccept,
    getComponent,
} from '../util';

export default function Element(props) {
    const {
        config,
        activeToolKey,
        pageConfig,
        selectedNodeId,
        draggingNode,
        dragPageAction,
        activeSideKey,
        iframeDocument,
    } = props;

    const isPreview = activeToolKey === 'preview';

    const prevSideKeyRef = useRef(null);

    // 预览时，不显示 DragHolder
    useEffect(() => {
        if (!iframeDocument) return;
        const holders = iframeDocument.querySelectorAll('.DragHolder');
        Array.from(holders).forEach(ele => {
            ele.style.display = isPreview ? 'none' : 'flex';
        });
    }, [isPreview, iframeDocument]);

    if (!config) return null;

    if (typeof config !== 'object' || Array.isArray(config)) return config;

    let {
        __config: {
            isContainer = true,
            componentId,
            componentType,
            componentDesc,
            componentDisplayName,
            draggable = true,
            withWrapper,
            wrapperStyle,
            actions = {},
        },
        componentName,
        children,
        props: componentProps = {},
    } = config;

    if (!componentName) return null;

    componentDesc = componentDesc || componentName;
    componentDisplayName = componentDisplayName || componentName;
    if (typeof componentDisplayName === 'function') componentDisplayName = componentDisplayName({node: config, pageConfig});

    let childrenEle = (children || []).map(item => (
        <Element
            config={item}
            activeToolKey={activeToolKey}
            pageConfig={pageConfig}
            draggingNode={draggingNode}
            selectedNodeId={selectedNodeId}
            dragPageAction={dragPageAction}
            activeSideKey={activeSideKey}
            iframeDocument={iframeDocument}
        />
    ));

    if (!childrenEle?.length) childrenEle = undefined;

    const dragClassName = [styles.element];

    if (selectedNodeId === componentId) dragClassName.push(styles.selected);
    if (draggingNode?.__config?.componentId === componentId) dragClassName.push(styles.dragging);
    if (!draggable) dragClassName.push(styles.unDraggable);

    const component = getComponent(componentName, componentType);

    const onDragStart = function(e) {
        e.stopPropagation();

        dragPageAction.setDraggingNode(config);
        prevSideKeyRef.current = activeSideKey;

        dragPageAction.setActiveSideKey('componentTree');

        // 拖拽携带的数据
        e.dataTransfer.setData('sourceComponentId', componentId);
    };

    function onDragEnter(e) {
        // 不要做任何导致当前页面render的操作，否则元素多了会很卡
        // e.stopPropagation();
        // e.preventDefault();

        // const targetElement = getDroppableEle(e.target);

        // if (!targetElement) return;

        // const targetId = targetElement.getAttribute('data-componentId');
        // 不要设置，否则会很卡
        // dragPageAction.setSelectedNodeId(targetId);
    }

    function onDragLeave() {
        dragPageAction.setDragOverInfo(null);
    }

    function onDragEnd() {
        dragPageAction.setDragOverInfo(null);
        dragPageAction.setDraggingNode(null);
        if (prevSideKeyRef.current) {
            dragPageAction.setActiveSideKey(prevSideKeyRef.current);
            prevSideKeyRef.current = null;
        }
    }

    function onDragOver(e) {
        // 不要做任何导致当前页面render的操作，否则元素多了会很卡
        e.stopPropagation();
        e.preventDefault();

        const targetElement = getDroppableEle(e.target);

        if (!targetElement) return;

        const targetComponentId = targetElement.getAttribute('data-componentId');

        // 放在自身上
        if (draggingNode?.__config?.componentId === targetComponentId) return;

        const {pageX, pageY, clientX, clientY} = e;

        const position = getDropPosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: iframeDocument,
        });

        if (!position) return;

        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });

        if (!accept) {
            // e.dataTransfer.dropEffect = 'move';
            // e.dataTransfer.effectAllowed = 'copy';
            return;
        }

        dragPageAction.setDragOverInfo({
            targetElement,
            pageX,
            pageY,
            clientX,
            clientY,
            guidePosition: position.guidePosition,
        });
    }

    function onDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const end = () => {
            onDragLeave(e);
            onDragEnd();
        };

        const targetElement = getDroppableEle(e.target);
        if (!targetElement) return end();

        const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
        let componentConfig = e.dataTransfer.getData('componentConfig');
        const targetComponentId = targetElement.getAttribute('data-componentId');

        if (targetComponentId === sourceComponentId) return end();

        const {pageX, pageY, clientX, clientY} = e;

        const position = getDropPosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: iframeDocument,
        });

        if (!position) return end();

        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });

        if (!accept) return end();

        if (sourceComponentId) {
            dragPageAction.moveNode({
                sourceId: sourceComponentId,
                targetId: targetComponentId,
                ...position,
            });
            dragPageAction.setSelectedNodeId(sourceComponentId);
        }

        if (componentConfig) {
            componentConfig = JSON.parse(componentConfig);
            dragPageAction.addNode({
                targetId: targetComponentId,
                node: componentConfig,
                ...position,
            });
            dragPageAction.setSelectedNodeId(componentConfig.__config?.componentId);
        }
        end();
    }

    const dragProps = {
        draggable,
        onDragStart,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        className: dragClassName.join(' '),
        'data-componentDesc': componentDesc,
        'data-componentDisplayName': componentDisplayName,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick: (e) => {
            // 竟然没有被 componentActions中的oClick覆盖 ？？？？
            e.stopPropagation && e.stopPropagation();
            const ele = getDroppableEle(e.target);

            if (!ele) return;

            // 小写。。。
            const id = ele.dataset.componentid;
            // const id = ele.getAttribute('data-componentId');
            dragPageAction.setSelectedNodeId(id);
        },
    };

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
        children: childrenEle,
        ...componentActions,
    };

    if (isPreview) {
        return createElement(component, {
            ...commonProps,
            ...componentProps,
        });
    }

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
        // 移动到 wrapper 的样式

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
            style: wStyle,
            children: [
                createElement(component, {
                    ...commonProps,
                    ...componentProps,
                    style,
                }),
            ],
        });
    }

    return createElement(component, {
        ...dragProps,
        ...commonProps,
        ...componentProps,
    });
}

// 可投放元素
function getDroppableEle(target) {
    if (!target) return target;

    if (typeof target.getAttribute !== 'function') return null;

    // 当前是容器
    let draggable = target.getAttribute('data-isContainer') === 'true';

    // 父级是容器
    if (!draggable && target.parentNode?.getAttribute) {
        draggable =
            target.parentNode.getAttribute('data-isContainer') === 'true'
            && target.getAttribute('data-componentId');
    }

    if (draggable) return target;

    return getDroppableEle(target.parentNode);
}

// 获取组件投放位置
function getDropPosition(options) {
    const guidePosition = getDropGuidePosition(options);

    const {position} = guidePosition;

    if (!position) return;

    let {
        isTop,
        isLeft,
        isBottom,
        isRight,
        isCenter: isChildren,
    } = position;

    if (isLeft || isRight) {
        isTop = false;
        isBottom = false;
        isChildren = false;
    }

    const isBefore = isTop || isLeft;
    const isAfter = isBottom || isRight;

    return {
        ...position,
        isBefore,
        isAfter,
        isChildren,
        guidePosition,
    };
}
