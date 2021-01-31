import {useRef, useEffect} from 'react';

import * as raLibComponent from 'ra-lib';
import * as components from './components';
import * as antdComponent from 'antd/es';

export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export function filterTree(array, filter) {
    const getNodes = (result, node) => {
        if (filter(node)) {
            result.push(node);
            return result;
        }
        if (Array.isArray(node.children)) {
            const children = node.children.reduce(getNodes, []);
            if (children.length) result.push({...node, children});
        }
        return result;
    };

    return array.reduce(getNodes, []);
}

export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

export function elementIsVisible(containerEle, element) {
    if (!element) return {};

    const containerHeight = containerEle.clientHeight;
    const containerScrollTop = containerEle.scrollTop;
    const elementRect = element.getBoundingClientRect();
    const containerRect = containerEle.getBoundingClientRect();
    const {y, height: elementHeight} = elementRect;
    const elementTop = y - containerRect.y + containerScrollTop;

    const elementBottom = elementTop + elementHeight;
    const containerShownHeight = containerScrollTop + containerHeight;

    // 可见
    const visible = !(elementTop > containerShownHeight
        || elementBottom < containerScrollTop);

    return {
        visible,
        elementTop,
        elementBottom,
        containerHeight,
        containerScrollTop,
        containerShownHeight,
    };

}

export function scrollElement(containerEle, element, toTop, force) {
    if (!element) return;

    const {
        visible,
        elementTop,
        containerHeight,
    } = elementIsVisible(containerEle, element);

    const scroll = () => {
        if (toTop) {
            // 滚动到顶部
            containerEle.scrollTop = elementTop;
        } else {
            // 滚动到中间
            containerEle.scrollTop = elementTop - containerHeight / 2;
        }
    };

    if (force) {
        scroll();
        return;
    }
    // 非可见
    if (!visible) {
        scroll();
    }
}

export function isDropAccept(options) {
    const {
        draggingNode,
        pageConfig,
        targetComponentId,
        isBefore,
        isAfter,
        isChildren,
    } = options;

    if (!draggingNode) return false;

    let targetNode;
    if (isChildren) targetNode = findNodeById(pageConfig, targetComponentId);
    if (isBefore || isAfter) targetNode = findParentNodeById(pageConfig, targetComponentId);

    if (!targetNode) return false;

    const config = targetNode.__config || {};
    const {isContainer = true} = config;

    if (!isContainer) return false;

    const dropAccept = targetNode?.__config?.dropAccept;

    if (dropAccept === undefined) return true;

    const {componentName} = draggingNode;

    return dropAccept.some(name => name === componentName);
}

export function findNodeById(root, id) {
    if (root.__config?.componentId === id) return root;

    if (!root.children) return null;

    for (let node of root.children) {
        const result = findNodeById(node, id);
        if (result) return result;
    }
}

export function findParentNodeById(root, id) {
    if (root.__config?.componentId === id) return null;

    if (!root.children) return null;

    if (root.children.some(item => item.__config?.componentId === id)) {
        return root;
    } else {
        for (let node of root.children) {
            const result = findParentNodeById(node, id);
            if (result) return result;
        }
    }
}

export function getDropGuidePosition(options) {
    const {
        event,
        targetElement,
        triggerSize = TRIGGER_SIZE,
        isContainer,
        isInFrame = true,
    } = options;

    const targetIsContainer = isContainer === undefined ? targetElement.getAttribute('data-isContainer') === 'true' : isContainer;

    const targetRect = targetElement.getBoundingClientRect();
    const {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    const _document = isInFrame ? document.getElementById('dnd-iframe').contentDocument : document;

    const scrollX = _document.documentElement.scrollLeft || _document.body.scrollLeft;
    const scrollY = _document.documentElement.scrollTop || _document.body.scrollTop;
    const x = event.pageX || event.clientX + scrollX;
    const y = event.pageY || event.clientY + scrollY;


    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + triggerSize;
        isBottom = y > targetY + targetHeight - triggerSize;
        isLeft = x < targetX + triggerSize;
        isRight = x > targetX + targetWidth - triggerSize;
        isCenter = y >= targetY + triggerSize && y <= targetY + targetHeight - triggerSize;
    } else {
        isTop = y < halfY;
        isBottom = !isTop;
        isLeft = x < halfX;
        isRight = !isLeft;
    }

    let guidePosition;
    if (isLeft || isRight) {
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
        isTop,
        isBottom,
        isCenter,
        isLeft,
        isRight,
        ...guidePosition,
    };
}

export function getComponent(componentName, componentType) {
    const [name, subName] = componentName.split('.');
    const com = Com => {
        if (subName) return Com[subName];

        return Com;
    };

    if (componentType === 'ra-lib') {
        const raCom = raLibComponent[name];

        if (raCom) return com(raCom);
    }
    const Com = components[name];

    if (Com) return com(Com);

    const AntdCom = antdComponent[name];

    if (AntdCom) return com(AntdCom);

    return name;
}
