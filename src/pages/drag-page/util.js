import {useRef, useEffect, createElement} from 'react';
import ReactDOM from 'react-dom';
import inflection from 'inflection';
import * as raLibComponent from 'ra-lib';
import * as components from './components';
import * as antdComponent from 'antd/es';
import * as antdIcon from '@ant-design/icons';
import {getComponentConfig} from 'src/pages/drag-page/component-config';

export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;
export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
// eslint-disable-next-line
export const SHOW_MODAL_FUNCTION = 'e => dragPageAction.showModal("${componentId}")';

// 调整id为首位
export function loopIdToFirst(node) {
    const id = node.id;
    Reflect.deleteProperty(node, 'id');

    const entries = Object.entries(node);
    if (!entries?.length) return;

    // 如果第一个key 不是 id
    if (entries[0][0] !== id) {
        // id 放首位
        entries.unshift(['id', id]);

        // 删除所有属性，保留引用
        entries.forEach(([key]) => Reflect.deleteProperty(node, key));

        // 从新赋值
        entries.forEach(([key, value]) => node[key] = value);
    }

    if (node.children?.length) {
        node.children.forEach(item => loopIdToFirst(item));
    }
}

// 同步设置对象，将newObj中属性，对应设置到oldObj中
export function syncObject(oldObj, newObj) {
    Object.entries(newObj).forEach(([key, value]) => {
        if (typeof value !== 'object') {
            oldObj[key] = value;
        } else {
            if (!(key in oldObj) || typeof oldObj[key] !== 'object') {
                oldObj[key] = value;
            } else {
                if (oldObj[key]) {
                    syncObject(oldObj[key], value);
                }
            }
        }
    });
}

// 删除所有非关联id
export function deleteUnLinkedIds(nodeConfig, keepIds = []) {
    let linkedIds = findLinkSourceComponentIds(nodeConfig);

    linkedIds = linkedIds.concat(keepIds);

    const loop = node => {
        if (!linkedIds.includes(node.id)) Reflect.deleteProperty(node, 'id');

        if (node.children?.length) {
            node.children.forEach(item => loop(item));
        }
    };
    loop(nodeConfig);
}

// 获取含有关联元素的ids
export function findLinkSourceComponentIds(pageConfig) {
    const ids = [];
    const loop = node => {
        const propsToSet = getComponentConfig(node.componentName).propsToSet;
        const componentId = node.id;

        if (propsToSet) {
            const targetIds = Object.entries(propsToSet)
                .map(([key, value]) => {
                    const str = value.replace(/\$\{componentId}/g, componentId);
                    return findLinkTargetComponentIds({
                        key,
                        value: str,
                        pageConfig,
                    });
                }).flat();

            // 存在target
            if (targetIds?.length) {
                ids.push(componentId);
            }
        }

        if (node.children?.length) {
            node.children.forEach(item => loop(item));
        }
    };
    loop(pageConfig);

    return ids;
}

// 获取所有关联目标组件id
function findLinkTargetComponentIds(options) {
    const {
        key,
        value,
        pageConfig,
    } = options;

    const result = [];
    const loop = (node) => {
        let {props} = node;
        if (!props) props = {};

        if (props[key] === value) {
            const targetComponentId = node?.id;
            result.push(targetComponentId);
        }
        if (node.children?.length) {
            node.children.forEach(item => loop(item));
        }
    };

    loop(pageConfig);

    return result;
}

// 获取关联元素位置
export function findLinkTargetsPosition(options) {
    const {pageConfig, selectedNode, iframeDocument} = options;

    const componentId = selectedNode?.id;
    const propsToSet = getComponentConfig(selectedNode.componentName).propsToSet;

    if (!propsToSet) return;

    return Object.entries(propsToSet)
        .map(([key, value]) => {
            const str = value.replace(/\$\{componentId}/g, componentId);
            return findElementPosition({
                pageConfig,
                key,
                value: str,
                componentId,
                iframeDocument,
            }) || [];
        }).flat();
}

// 获取位置
function findElementPosition(options) {
    const {
        key,
        value,
        componentId: sourceComponentId,
        iframeDocument,
        pageConfig,
    } = options;
    const targetIds = findLinkTargetComponentIds({
        key,
        value,
        pageConfig,
    });

    return targetIds.map(targetComponentId => {
        const ele = iframeDocument.querySelector(`[data-componentId="${targetComponentId}"]`);
        if (!ele) return false;
        const {x, y, width, height} = ele.getBoundingClientRect();
        return {
            key: `${value}__${targetComponentId}`,
            propsKey: key,
            propsValue: value,
            endX: x + width / 2,
            endY: y + height / 2,
            targetComponentId,
            sourceComponentId,
        };
    }).filter(item => !!item);
}

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

// 记录前一次渲染时数据
export function usePrevious(value) {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

// 获取元素中间位置
export function getEleCenterInWindow(element) {
    if (!element) return null;

    const {x, y, width, height} = element.getBoundingClientRect();

    return {
        x: x + width / 2,
        y: y + height / 2,
    };
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
export function scrollElement(containerEle, element, toTop, force, offset = 0) {
    if (!element) return;

    const {
        visible,
        elementTop,
        containerHeight,
    } = elementIsVisible(containerEle, element);

    const scroll = () => {
        if (toTop) {
            // 滚动到顶部
            containerEle.scrollTop = elementTop + offset;
        } else {
            // 滚动到中间
            containerEle.scrollTop = elementTop - containerHeight / 2 + offset;
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

/**
 * 获取 id 对应的所有祖先节点
 * @param root
 * @param id
 * @returns {*|[]}
 */
export function getParentIds(root, id) {
    const data = Array.isArray(root) ? root : [root];

    // 深度遍历查找
    function dfs(data, id, parents) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            // 找到id则返回父级id
            if (item.id === id) return parents;
            // children不存在或为空则不递归
            if (!item.children || !item.children.length) continue;
            // 往下查找时将当前id入栈
            parents.push(item.id);

            if (dfs(item.children, id, parents).length) return parents;
            // 深度遍历查找未找到时当前id 出栈
            parents.pop();
        }
        // 未找到时返回空数组
        return [];
    }

    return dfs(data, id, []);
}

// 获取节点元素
export function getNodeEle(target) {
    if (!target) return target;

    if (typeof target.getAttribute !== 'function') return null;

    // 当前是组件节点
    let isNodeEle = target.getAttribute('data-componentId');

    // 父级是容器
    if (!isNodeEle && target.parentNode?.getAttribute) {
        isNodeEle = target.getAttribute('data-componentId');
    }

    if (isNodeEle) return target;

    return getDroppableEle(target.parentNode);
}

// 可投放元素
export function getDroppableEle(target) {
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
export function getDropPosition(options) {
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

    if (draggingNode.propsToSet) return true;

    let targetNode;
    if (isChildren) targetNode = findNodeById(pageConfig, targetComponentId);
    if (isBefore || isAfter) targetNode = findParentNodeById(pageConfig, targetComponentId);

    if (!targetNode) return false;

    // 不允许父节点拖入子节点
    if (isChildrenNode(draggingNode, targetNode)) return false;

    const targetConfig = getComponentConfig(targetNode.componentName);
    const sourceConfig = getComponentConfig(draggingNode.componentName);

    const {isContainer = true} = targetConfig;

    if (!isContainer) return false;

    let {dropInTo} = sourceConfig;


    const args = {
        draggingNode,
        targetNode,
        pageConfig,
    };

    if (typeof dropInTo === 'function') {
        if (!dropInTo(args)) return false;
    }

    if (typeof dropInTo === 'string') dropInTo = [dropInTo];

    if (Array.isArray(dropInTo)) {
        if (!dropInTo.includes(targetNode.componentName)) return false;
    }


    let {dropAccept} = targetConfig;


    if (typeof dropAccept === 'function') {

        return dropAccept(args);
    }

    if (typeof dropAccept === 'string') dropAccept = [dropAccept];

    if (!Array.isArray(dropAccept)) return true;

    const {componentName} = draggingNode;

    return dropAccept.some(name => name === componentName);
}

// 检查是否是某个节点的子节点
export function isChildrenNode(parentNode, childrenNode) {
    if (!parentNode) return false;

    const id = childrenNode?.id;

    if (!id) return false;
    return !!findNodeById(parentNode, id);
}

// 根据id查找节点
export function findNodeById(root, id) {
    if (root.id === id) return root;

    if (!root.children) return null;

    for (let node of root.children) {
        const result = findNodeById(node, id);
        if (result) return result;
    }
}

// 根据id查找父节点
export function findParentNodeById(root, id) {
    if (root.id === id) return null;

    if (!root.children) return null;

    if (root.children.some(item => item.id === id)) {
        return root;
    } else {
        for (let node of root.children) {
            const result = findParentNodeById(node, id);
            if (result) return result;
        }
    }
}

// 根据id查找具体名称对应的祖先节点
export function findParentNodeByParentName(node, name, id) {
    const child = findNodeById(node, id);
    if (node.componentName === name && child) return node;
    if (node?.children?.length) {
        for (let n of node.children) {
            const result = findParentNodeByParentName(n, name, id);
            if (result) return result;
        }
    }
}

// 根据componentName获取所有节点
export function getAllNodesByName(node, name) {
    const nodes = [];
    const loop = n => {
        if (n.componentName === name) {
            nodes.push(n);
        }

        if (n?.children?.length) {
            n.children.forEach(i => loop(i));
        }
    };
    loop(node);

    return nodes;
}

// 获取拖放提示位置
export function getDropGuidePosition(options) {
    const {
        pageX = 0,
        pageY = 0,
        clientX = 0,
        clientY = 0,
        targetElement,
        frameDocument,
    } = options;

    if (!targetElement) return {
        position: {
            isTop: false,
            isRight: false,
            isBottom: false,
            isLeft: false,
            isCenter: false,
        },
        guideLine: {
            left: 0,
            top: 0,
            width: 0,
            height: 0,
        },
        target: {
            targetHeight: 0,
            targetWidth: 0,
            targetX: 0,
            targetY: 0,
            targetRect: {},
        },
    };

    const targetIsContainer = targetElement.getAttribute('data-isContainer') === 'true';
    const targetRect = targetElement.getBoundingClientRect();

    const documentElement = frameDocument.documentElement || frameDocument.body;
    const windowHeight = documentElement.clientHeight;
    const windowWidth = documentElement.clientWidth;

    const scrollX = documentElement.scrollLeft;
    const scrollY = documentElement.scrollTop;

    const x = pageX || clientX + scrollX;
    const y = pageY || clientY + scrollY;

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

    const triggerSizeHeight = targetHeight > TRIGGER_SIZE * 3 ? TRIGGER_SIZE : targetHeight / 3;
    const triggerSizeWidth = targetWidth > TRIGGER_SIZE * 3 ? TRIGGER_SIZE : targetWidth / 3;

    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + triggerSizeHeight;
        isRight = x > targetX + targetWidth - triggerSizeWidth;
        isBottom = y > targetY + targetHeight - triggerSizeHeight;
        isLeft = x < targetX + triggerSizeWidth;
        isCenter = y >= targetY + triggerSizeHeight && y <= targetY + targetHeight - triggerSizeHeight;
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

    const position = {
        isTop,
        isRight,
        isBottom,
        isLeft,
        isCenter,
    };

    const target = {
        targetHeight,
        targetWidth,
        targetX,
        targetY,
        targetRect,
    };

    return {
        position,
        guideLine: guidePosition,
        target,
    };
}

// 根据 componentName 获取组件
export function getComponent(options) {
    let {componentName} = options;
    const componentConfig = getComponentConfig(componentName);
    const {renderComponentName, componentType} = componentConfig;

    componentName = renderComponentName || componentName;

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

    const AntdIcon = antdIcon[name];
    if (AntdIcon) return com(AntdIcon);

    return name;
}

// 复制兼容函数
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
