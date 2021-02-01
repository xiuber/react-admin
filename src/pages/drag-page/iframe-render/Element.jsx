import React, {createElement, useRef, useEffect} from 'react';
import styles from './style.less';
import {
    getDropGuidePosition,
    TRIGGER_SIZE,
    isDropAccept,
    getComponent,
} from '../util';

export default function Element(props) {
    const prevSideKeyRef = useRef(null);

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

    // 预览时，不显示 DragHolder
    useEffect(() => {
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
            draggable = true,
            withWrapper,
            wrapperStyle,
        },
        componentName,
        children,
        props: componentProps = {},
    } = config;

    if (!componentName) return null;

    componentDesc = componentDesc || componentName;

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

        e.dataTransfer.setData('sourceComponentId', componentId);
    };

    function getPosition(options) {
        const position = getDropGuidePosition(options);

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

        return {...position, isBefore, isAfter, isChildren};
    }

    const onDragOver = function(e) {
        e.stopPropagation();
        e.preventDefault();

        const targetElement = getDroppableEle(e.target);

        if (!targetElement) return;

        const targetComponentId = targetElement.getAttribute('data-componentId');

        if (draggingNode?.__config?.componentId === targetComponentId) return;

        const position = getPosition({
            event: e,
            targetElement,
        });

        if (!position) return;

        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });

        if (!accept) {
            hideDropGuide();
            return;
        }

        showDropGuideLine(e, targetElement, position);
    };
    const onDrop = function(e) {
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

        const position = getPosition({
            event: e,
            targetElement,
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
    };

    function onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();

        const targetElement = getDroppableEle(e.target);
        if (!targetElement) return;

        const targetId = targetElement.getAttribute('data-componentId');
        dragPageAction.setSelectedNodeId(targetId);


        targetElement.classList.add(styles.dragEnter);
        const targetRect = targetElement.getBoundingClientRect();
        const {height} = targetRect;
        const targetIsContainer = targetElement.getAttribute('data-isContainer') === 'true';

        if (targetIsContainer) {
            if (height < TRIGGER_SIZE * 3) {
                targetElement.setAttribute('data-change-padding', true);
                targetElement.setAttribute('data-prev-padding', targetElement.style.padding);

                targetElement.style.padding = '30px 0';
            }
        }
    }

    function onDragLeave(e) {
        hideDropGuide();
        const targetElement = getDroppableEle(e.target);
        if (!targetElement) return;

        targetElement.classList.remove(styles.dragEnter);

        const targetIsContainer = targetElement.getAttribute('data-isContainer') === 'true';
        if (targetIsContainer) {
            const changePadding = targetElement.getAttribute('data-change-padding');

            if (changePadding) {
                targetElement.style.padding = targetElement.getAttribute('data-prev-padding');
            }
        }
    }

    function onDragEnd() {
        dragPageAction.setDraggingNode(null);
        if (prevSideKeyRef.current) dragPageAction.setActiveSideKey(prevSideKeyRef.current);
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
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick: (e) => {
            e.stopPropagation && e.stopPropagation();
            const ele = getDroppableEle(e.target);

            if (!ele) return;

            const id = ele.getAttribute('data-componentId');
            dragPageAction.setSelectedNodeId(id);
        },
    };

    if (isPreview) {
        return createElement(component, {
            ...componentProps,
            getPopupContainer: () => iframeDocument.body,
            children: childrenEle,
        });
    }

    if (withWrapper) {
        const {style = {}} = componentProps;
        const {
            display,
            width,
            height,
        } = style;
        return createElement('div', {
            ...dragProps,
            style: {
                ...wrapperStyle,
                display,
                width,
                height,
            },
            children: [
                createElement(component, {
                    ...componentProps,
                    getPopupContainer: () => iframeDocument.body,
                    children: childrenEle,
                }),
            ],
        });
    }

    return createElement(component, {
        ...componentProps,
        ...dragProps,
        getPopupContainer: () => iframeDocument.body,
        children: childrenEle,
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

function showDropGuideLine(e, targetElement, position) {
    let {
        isCenter,
        isLeft,
        isRight,
        isTop,
        isBottom,
        top,
        left,
        width,
        height,
    } = position;

    if (isLeft || isRight) {
        isCenter = false;
        isTop = false;
        isBottom = false;
    }

    const guidePosition = {
        top,
        width,
        height,
        left,
    };

    const frameDocument = document.getElementById('dnd-iframe').contentDocument;
    const guideLineEle = frameDocument.getElementById('drop-guide-line');

    if (!guideLineEle) return;

    const guildTipEle = guideLineEle.querySelector('span');

    guideLineEle.classList.add(styles.guideActive);
    guideLineEle.classList.remove(styles.gLeft);
    guideLineEle.classList.remove(styles.gRight);
    if (isLeft) {
        guildTipEle.innerHTML = '前';
        guideLineEle.classList.add(styles.gLeft);
    }
    if (isRight) {
        guildTipEle.innerHTML = '后';
        guideLineEle.classList.add(styles.gRight);
    }
    if (isTop) guildTipEle.innerHTML = '上';
    if (isBottom) guildTipEle.innerHTML = '下';
    if (isCenter) guildTipEle.innerHTML = '内';

    Object.entries(guidePosition).forEach(([key, value]) => {
        guideLineEle.style[key] = `${value}px`;
    });
}


function hideDropGuide() {
    const frameDocument = document.getElementById('dnd-iframe').contentDocument;

    const guideLineEle = frameDocument.getElementById('drop-guide-line');
    if (!guideLineEle) return;

    guideLineEle.classList.remove(styles.guideActive);
}
