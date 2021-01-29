import React, {createElement, useRef} from 'react';
import styles from './style.less';
import * as antdComponent from 'antd/es';
import * as raLibComponent from 'ra-lib';
import * as components from './components';

const LINE_SIZE = 2;
const TRIGGER_SIZE = 20;
const DROP_GUIDE_COLOR = '#14ee69';

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

function getDraggableEle(target) {
    if (!target) return target;

    if (typeof target.getAttribute !== 'function') return null;

    const draggable = target.getAttribute('draggable');

    if (draggable) return target;

    return getDraggableEle(target.parentNode);
}

function getDropGuidePosition(e, targetElement) {
    const targetIsContainer = targetElement.getAttribute('data-isContainer');

    const targetRect = targetElement.getBoundingClientRect();
    const {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    const frameDocument = document.getElementById('dnd-iframe').contentDocument;

    const scrollX = frameDocument.documentElement.scrollLeft || frameDocument.body.scrollLeft;
    const scrollY = frameDocument.documentElement.scrollTop || frameDocument.body.scrollTop;
    const x = e.pageX || e.clientX + scrollX;
    const y = e.pageY || e.clientY + scrollY;


    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + TRIGGER_SIZE;
        isBottom = y > targetY + targetHeight - TRIGGER_SIZE;
        isLeft = x < targetX + TRIGGER_SIZE;
        isRight = x > targetX + targetWidth - TRIGGER_SIZE;
        isCenter = y >= targetY + TRIGGER_SIZE && y <= targetY + targetHeight - TRIGGER_SIZE;
    } else {
        isTop = y < halfY;
        isBottom = !isTop;
        isLeft = x < halfX;
        isRight = !isLeft;
    }

    let guidePosition;
    if (isLeft || isRight) {
        isCenter = false;
        isBottom = false;
        isTop = false;
        const left = isLeft ? targetX : targetX + targetWidth - LINE_SIZE;

        guidePosition = {
            left,
            top: targetY,
            height: targetHeight,
            width: LINE_SIZE,
        };
    } else {
        let top = isTop ? targetY : null;
        top = isBottom ? targetY + targetHeight - LINE_SIZE : top;
        top = isCenter ? halfY - LINE_SIZE / 2 : top;

        guidePosition = {
            left: targetX,
            top,
            width: targetWidth,
            height: LINE_SIZE,
        };
    }

    return {
        isTop, isBottom, isCenter, isLeft, isRight,
        ...guidePosition,
    };
}

function showDropGuideLine(e, targetElement) {
    // const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
    // console.log(sourceComponentId);
    const position = getDropGuidePosition(e, targetElement);
    const {isCenter, top, left, width, height} = position;
    const guidePosition = {
        top,
        width,
        height,
        left,
    };

    const frameDocument = document.getElementById('dnd-iframe').contentDocument;
    const guideLineEle = frameDocument.getElementById('drop-guide-line');
    const componentDesc = targetElement.getAttribute('data-componentDesc');

    if (!guideLineEle) return;

    if (isCenter) {
        guideLineEle.innerHTML = `<div style="
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: ${DROP_GUIDE_COLOR};
            padding: 0 4px;
            ">${componentDesc} 内</div>`;
    } else {
        guideLineEle.innerHTML = '';
    }

    guideLineEle.style.backgroundColor = DROP_GUIDE_COLOR;
    guideLineEle.style.display = 'block';

    Object.entries(guidePosition).forEach(([key, value]) => {
        guideLineEle.style[key] = `${value}px`;
    });
}


function hideDropGuide() {
    const frameDocument = document.getElementById('dnd-iframe').contentDocument;

    const guideLineEle = frameDocument.getElementById('drop-guide-line');
    if (!guideLineEle) return;

    guideLineEle.style.display = 'none';
}


export default function Element(props) {
    const draggingRef = useRef(null);

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
            isContainer,
            isRoot,
            componentId,
            componentType,
            componentDesc,
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

    const component = getComponent(componentName, componentType);

    const onDragStart = function(e) {
        e.stopPropagation();
        dragPageAction.setDraggingNodeId(componentId);

        draggingRef.current = e.target;
        draggingRef.current.classList.add(styles.dragging);

        e.dataTransfer.setData('sourceComponentId', componentId);
    };

    const onDragOver = function(e) {
        e.stopPropagation();
        e.preventDefault();

        const targetElement = getDraggableEle(e.target);
        if (!targetElement) return;
        if (dragPage.draggingNodeId !== componentId) {
            showDropGuideLine(e, targetElement);
        }
    };
    const onDrop = function(e) {
        e.preventDefault();
        e.stopPropagation();

        const targetElement = getDraggableEle(e.target);
        if (!targetElement) return;

        const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
        let componentConfig = e.dataTransfer.getData('componentConfig');

        if (componentId === sourceComponentId) return;

        const position = getDropGuidePosition(e, targetElement);

        if (!position) return;
        const {
            isTop,
            isLeft,
            isBottom,
            isRight,
            isCenter: isChildren,
        } = position;

        const isBefore = isTop || isLeft;
        const isAfter = isBottom || isRight;

        if (sourceComponentId) {
            dragPageAction.moveNode({
                sourceId: sourceComponentId,
                targetId: componentId,
                isBefore,
                isAfter,
                isChildren,
            });
        }

        if (componentConfig) {
            componentConfig = JSON.parse(componentConfig);
            dragPageAction.addNode({
                targetId: componentId,
                isBefore,
                isAfter,
                isChildren,
                node: componentConfig,
            });
        }

        onDragLeave(e);
        onDragEnd();
    };

    function onDragEnter(e) {
        const targetElement = getDraggableEle(e.target);
        if (!targetElement) return;

        targetElement.classList.add(styles.dragEnter);
        const targetRect = targetElement.getBoundingClientRect();
        const {height} = targetRect;
        const targetIsContainer = targetElement.getAttribute('data-isContainer');

        if (targetIsContainer) {
            if (height < TRIGGER_SIZE * 3) {
                targetElement.setAttribute('data-change-padding', true);
                targetElement.setAttribute('data-prev-padding', targetElement.style.padding);

                targetElement.style.padding = '30px 0';
            }
        }
    }

    function onDragLeave(e) {
        const targetElement = getDraggableEle(e.target);
        if (!targetElement) return;

        targetElement.classList.remove(styles.dragEnter);

        const targetIsContainer = targetElement.getAttribute('data-isContainer');
        if (targetIsContainer) {
            const changePadding = targetElement.getAttribute('data-change-padding');

            if (changePadding) {
                targetElement.style.padding = targetElement.getAttribute('data-prev-padding');
            }
        }
    }

    function onDragEnd() {
        dragPageAction.setDraggingNodeId(null);
        draggingRef.current && draggingRef.current.classList.remove(styles.dragging);
        hideDropGuide();
    }

    return createElement(component, {
        ...others,
        draggable: !isRoot,
        onDragStart,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        className: clcs.join(' '),
        children: childrenEle,
        getPopupContainer: () => iframeDocument.body,
        'data-componentDesc': componentDesc,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick: (e) => {
            e.stopPropagation();
            dragPageAction.setSelectedNodeId(componentId);
        },
    });
}

