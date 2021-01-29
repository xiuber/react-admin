import React, {createElement} from 'react';
import styles from './style.less';
import * as antdComponent from 'antd/es';
import * as raLibComponent from 'ra-lib';
import * as components from './components';
import {getDropGuidePosition, TRIGGER_SIZE} from './util';

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


function showDropGuideLine(e, targetElement) {
    // const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
    // console.log(sourceComponentId);
    const position = getDropGuidePosition({
        event: e,
        targetElement,
    });
    let {isCenter, isLeft, isRight, top, left, width, height} = position;

    if (isLeft || isRight) isCenter = false;

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
    if (dragPage.draggingNodeId === componentId) clcs.push(styles.dragging);

    const component = getComponent(componentName, componentType);

    const onDragStart = function(e) {
        e.stopPropagation();
        dragPageAction.setDraggingNodeId(componentId);

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

        const position = getDropGuidePosition({
            event: e,
            targetElement,
        });

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

