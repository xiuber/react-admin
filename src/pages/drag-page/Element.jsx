import React, {createElement, useRef} from 'react';
import styles from './style.less';
import * as antdComponent from 'antd/es';
import * as raLibComponent from 'ra-lib';
import * as components from './components';
import {
    getDropGuidePosition,
    TRIGGER_SIZE,
    isDropAccept,
} from './util';

function getComponent(componentName, componentType) {
    if (componentType === 'ra-lib') {
        const raCom = raLibComponent[componentName];

        if (raCom) return raCom;
    }
    const Com = components[componentName];

    if (Com) return Com;

    const AntdCom = antdComponent[componentName];

    if (AntdCom) return AntdCom;

    return componentName;
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

export default function Element(props) {
    const prevSideKeyRef = useRef(null);

    const {
        config,
        dragPage,
        dragPageAction,
        iframeDocument,
    } = props;

    if (!config) return null;

    if (typeof config !== 'object' || Array.isArray(config)) return config;

    let {
        __config: {
            isContainer = true,
            componentId,
            componentType,
            componentDesc,
            draggable = true,
        },
        componentName,
        children,
        className,
        ...others
    } = config;

    if (!componentName) return null;

    componentDesc = componentDesc || componentName;

    const childrenEle = (children || []).map(item => (
        <Element
            config={item}
            dragPage={dragPage}
            dragPageAction={dragPageAction}
            iframeDocument={iframeDocument}
        />
    ));

    const clcs = [styles.element, className];

    if (dragPage.selectedNodeId === componentId) clcs.push(styles.selected);
    if (dragPage.draggingNode?.__config?.componentId === componentId) clcs.push(styles.dragging);
    if (!draggable) clcs.push(styles.unDraggable);

    const component = getComponent(componentName, componentType);

    const onDragStart = function(e) {
        e.stopPropagation();

        dragPageAction.setDraggingNode(config);
        prevSideKeyRef.current = dragPage.activeSideKey;

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

        if (dragPage.draggingNode?.__config?.componentId === targetComponentId) return;

        const position = getPosition({
            event: e,
            targetElement,
        });

        if (!position) return;

        const accept = isDropAccept({
            draggingNode: dragPage.draggingNode,
            pageConfig: dragPage.pageConfig,
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
            draggingNode: dragPage.draggingNode,
            pageConfig: dragPage.pageConfig,
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

    return createElement(component, {
        ...others,
        draggable,
        onDragStart,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        className: clcs.join(' '),
        dragClassName: clcs.join(' '),
        children: childrenEle,
        getPopupContainer: () => iframeDocument.body,
        'data-componentDesc': componentDesc,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick: (e) => {
            e.stopPropagation();
            const ele = getDroppableEle(e.target);

            if (!ele) return;

            const id = ele.getAttribute('data-componentId');
            dragPageAction.setSelectedNodeId(id);
        },
    });
}

