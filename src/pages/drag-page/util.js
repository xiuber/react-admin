import {useRef, useEffect, createElement} from 'react';
import ReactDOM from 'react-dom';
import inflection from 'inflection';
import * as raLibComponent from 'ra-lib';
import * as components from './components';
import * as antdComponent from 'antd/es';

export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;
export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

// css 样式字符串 转 js 样式对象
export function cssToObject(css) {
    if (!css) return {};

    css = css.replace(/"/g, '');

    const ele = document.createElement('div');
    ele.innerHTML = `<div style="${css}"></div>`;

    const style = ele.childNodes[0].style || {};

    const cssKeys = css.split(';').map(item => {
        const cssKey = item.split(':')[0].replace(/-/g, '_');
        const key = inflection.camelize(cssKey, true);

        return key.trim();
    }).filter(item => !!item);

    return cssKeys.reduce((prev, key) => {
        const value = style[key];
        if (
            value === ''
            || value === 'initial'
            || key.startsWith('webkit')
            || !window.isNaN(key) // key 是数字
        ) return prev;

        prev[key] = value;
        return prev;
    }, {});
}


// js 样式对象 转 css 字符串
export async function objectToCss(style) {
    return new Promise((resolve, reject) => {

        if (!style) return resolve('');

        const ele = document.createElement('div');
        ele.style.position = 'fixed';
        ele.style.zIndex = -999;
        ele.style.top = '-1000px';

        document.body.append(ele);

        ReactDOM.render(createElement('div', {style}), ele);

        setTimeout(() => {
            const css = ele.childNodes[0].style.cssText;

            ele.remove();

            resolve(css);
        });
    });
}


// 表单值转换，纯数字字符串，转换为数字 并不允许输入空格
export function getNumberValueFromEvent(e) {
    let {value} = e.target;
    if (!value) return value;

    // 不允许输入空格
    value = value.replace(/\s/g, '');

    if (value.endsWith('.')) return value;

    // 为纯数字 直接转换为数字
    if (!window.isNaN(value)) {
        return window.parseFloat(value);
    }

    return value;
}

// 表单值转换，不允许输入空格
export function getNoSpaceValueFromEvent(e) {
    let {value} = e.target;
    if (!value) return value;

    // 不允许输入空格
    value = value.replace(/\s/g, '');

    return value;
}

// 树过滤函数
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

// 元素是否在可视窗口内
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

// 果冻元素到可视窗口内
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

// 是否接受放入
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

    // 不允许父节点拖入子节点
    if (isChildrenNode(draggingNode, targetNode)) return false;

    const config = targetNode.__config || {};
    const {isContainer = true} = config;

    if (!isContainer) return false;

    let dropAccept = targetNode?.__config?.dropAccept;

    const args = {
        draggingNode,
        targetNode,
        pageConfig,
    };

    dropAccept = typeof dropAccept === 'function' ? dropAccept(args) : dropAccept;

    if (!Array.isArray(dropAccept)) return true;

    const {componentName} = draggingNode;

    return dropAccept.some(name => name === componentName);
}

// 检查是否是某个节点的子节点
export function isChildrenNode(parentNode, childrenNode) {
    if (!parentNode) return false;

    const id = childrenNode?.__config?.componentId;

    if (!id) return false;
    return !!findNodeById(parentNode, id);
}

// 根据id查找节点
export function findNodeById(root, id) {
    if (root.__config?.componentId === id) return root;

    if (!root.children) return null;

    for (let node of root.children) {
        const result = findNodeById(node, id);
        if (result) return result;
    }
}

// 根据id查找父节点
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

// 获取拖放提示位置
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

    const _document = isInFrame ? document.getElementById('dnd-iframe').contentDocument : document;
    const documentElement = _document.documentElement || _document.body;
    const windowHeight = documentElement.clientHeight;
    const windowWidth = documentElement.clientWidth;

    const scrollX = documentElement.scrollLeft;
    const scrollY = documentElement.scrollTop;

    const x = event.pageX || event.clientX + scrollX;
    const y = event.pageY || event.clientY + scrollY;

    let {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    // 获取可视范围
    if (targetY < 0) {
        targetHeight = targetHeight + targetY;
        targetY = 0;
    }
    if (targetHeight + targetY > windowHeight) targetHeight = windowHeight - targetY;

    if (targetX < 0) {
        targetWidth = targetWidth + targetX;
        targetX = 0;
    }
    if (targetWidth + targetX > windowWidth) targetWidth = windowWidth - targetX;


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
        targetRect,
    };
}

// 根据 componentName 获取组件
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

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
    }

    document.body.removeChild(textArea);
}

// 复制到剪切板
export function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    // 返回promise
    navigator.clipboard.writeText(text);
}

// 获取剪切板中内容
export function getTextFromClipboard() {
    return navigator.clipboard.readText();
}
