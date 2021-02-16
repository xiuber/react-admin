import {useRef, useEffect, createElement} from 'react';
import ReactDOM from 'react-dom';
import inflection from 'inflection';
import * as raLibComponent from 'ra-lib';
import * as components from './components';
import * as antdComponent from 'antd/es';
import * as antdIcon from '@ant-design/icons';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {v4 as uuid} from 'uuid';
import {debounce} from 'lodash';

export const OTHER_HEIGHT = 0;

export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;
export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
// eslint-disable-next-line

const toggleIsWrapper = debounce((draggingNode) => {
    draggingNode.isWrapper = !draggingNode.isWrapper;
}, 100);

const toggleIsToSetProps = debounce((draggingNode) => {
    if (!draggingNode.propsToSet) return;

    draggingNode.toSetProps = !draggingNode.toSetProps;
}, 100);

export function getDraggingNodeInfo({e, draggingNode}) {
    if (!e) return draggingNode || {};

    const isMetaOrCtrl = (e.metaKey || e.ctrlKey);
    const isAltKey = e.altKey;

    if (isMetaOrCtrl) {
        toggleIsWrapper(draggingNode);
    }

    if (isAltKey) {
        toggleIsToSetProps(draggingNode);
    }

    return draggingNode || {};
}

export function loopPageConfig(node, cb) {
    cb(node);

    if (node.children?.length) {
        node.children.forEach(item => loopPageConfig(item, cb));
    }
    // props中有可能也有节点
    Object.values(node.props || {})
        .filter(value => isComponentConfig(value))
        .forEach(value => loopPageConfig(value, cb));

    // wrapper中有节点
    if (node.wrapper?.length) {
        node.wrapper.forEach(item => loopPageConfig(item, cb));
    }
}

export function isFunctionString(value) {
    return value
        && typeof value === 'string'
        && (value.includes('function') || value.includes('=>'));
}

// 获取obj中字段名，比如 field = visible, obj中存在obj.visible,将得到 visible2
export function getNextField(obj, field) {
    if (!(field in obj)) return field;

    const nums = [0];
    Object.keys(obj).forEach(key => {
        console.log(key);
        const result = RegExp(`${field}(\\d+$)`).exec(key);
        if (result) {
            console.log(result);
            nums.push(window.parseInt(result[1]));
        }
    });

    const num = Math.max(...nums) + 1;

    return `${field}${num}`;
}

// 节点渲染之后，统一处理函数，用于给没有透传props属性的组件，添加拖拽相关属性
export function handleAfterRender(options) {
    const {node, dragProps, iframeDocument, isPreview, element} = options;
    if (!iframeDocument) return;
    const {id} = node;

    const ele = element || iframeDocument.querySelector(`.id_${id}`);

    if (!ele) return;

    Object.entries(dragProps)
        .forEach(([key, value]) => {
            if (isPreview) {
                ele.removeAttribute(key);
            } else {
                ele.setAttribute(key, value);
            }
        });
}

// 设置拖拽图片
export function setDragImage(e, node) {
    // const img = new Image();
    // img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';
    // e.dataTransfer.setDragImage(img, -20, -30);
}

export function isComponentConfig(node) {
    return !!node?.componentName;
}

export function deleteNodeId(node) {
    loopPageConfig(node, node => {
        Reflect.deleteProperty(node, 'id');
    });
}

// 设置id
export function setNodeId(node, force) {
    loopPageConfig(node, node => {
        if (force) return node.id = uuid();

        if (!node.id) node.id = uuid();
    });
}

// 调整id为首位
export function loopIdToFirst(node) {
    loopPageConfig(node, node => {
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
    });
}

// 同步设置对象，将newObj中属性，对应设置到oldObj中
export function syncObject(oldObj, newObj) {
    Object.entries(newObj)
        .forEach(([key, value]) => {
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

    loopPageConfig(nodeConfig, node => {
        if (!linkedIds.includes(node.id)) Reflect.deleteProperty(node, 'id');
    });
}

// 获取含有关联元素的ids
export function findLinkSourceComponentIds(pageConfig) {
    const ids = [];
    loopPageConfig(pageConfig, node => {
        const propsToSet = node.propsToSet;
        const componentId = node.id;

        if (propsToSet) {
            const targetIds = Object.entries(propsToSet)
                .filter(([, value]) => (typeof value === 'string'))
                .map(([key, value]) => {
                    return findLinkTargetComponentIds({
                        key,
                        value,
                        pageConfig,
                    });
                }).flat();

            // 存在target
            if (targetIds?.length) {
                ids.push(componentId);
            }
        }
    });

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

    loopPageConfig(pageConfig, node => {
        let {props} = node;
        if (!props) props = {};

        if (props[key] === value) {
            const targetComponentId = node?.id;
            result.push(targetComponentId);
        }
    });

    return result;
}

// 获取关联元素位置
export function findLinkTargetsPosition(options) {
    const {pageConfig, selectedNode, iframeDocument} = options;

    if (!selectedNode) return;

    const {id: componentId, propsToSet} = selectedNode;

    if (!propsToSet) return;

    return Object.entries(propsToSet)
        .map(([key, value]) => {
            return findElementPosition({
                pageConfig,
                key,
                value,
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
        const ele = iframeDocument.querySelector(`[data-component-id="${targetComponentId}"]`);
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
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
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
    let isNodeEle = target.getAttribute('data-component-id');

    // 父级是容器
    if (!isNodeEle && target.parentNode?.getAttribute) {
        isNodeEle = target.getAttribute('data-component-id');
    }

    if (isNodeEle) return target;

    return getDroppableEle(target.parentNode);
}

// 可投放元素 自身是容器，或则父级组件是容器
export function getDroppableEle(target) {
    if (!target) return target;

    const loop = node => {
        if (!node) return null;
        if (
            node?.getAttribute
            && node.getAttribute('data-component-id')
        ) {

            return node;
        }

        return loop(node.parentNode);
    };

    const componentEle = loop(target);

    if (!componentEle) return null;

    // 当前是容器
    let draggable = componentEle.getAttribute('data-is-container') === 'true';
    if (draggable) return componentEle;

    // 父组件是容器
    const parentComponent = loop(componentEle.parentNode);
    if (parentComponent?.getAttribute('data-is-container') === 'true') {
        return componentEle;
    }

    // 继续向上找
    return getDroppableEle(parentComponent);
}

export function handleNodDrop(options) {
    const {
        e,
        iframeDocument,
        end,
        pageConfig,
        draggingNode,
        dragPageAction,
    } = options;

    const {isWrapper, toSetProps} = getDraggingNodeInfo({e, draggingNode});
    if (toSetProps) {
        const propsToSet = e.dataTransfer.getData('propsToSet') || draggingNode.propsToSet;
        // 组件节点
        const nodeEle = getNodeEle(e.target);
        if (!nodeEle) return end();

        const newProps = typeof propsToSet === 'string' ? JSON.parse(propsToSet) : propsToSet;

        // 如果是组件节点，设置id
        Object.values(newProps)
            .filter(value => isComponentConfig(value))
            .forEach(value => {
                setNodeId(value, true);
            });

        const componentId = nodeEle.getAttribute('data-component-id');

        dragPageAction.setNewProps({componentId, newProps});

        return end();
    }

    const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
    let componentConfig = e.dataTransfer.getData('componentConfig');
    componentConfig = componentConfig ? JSON.parse(componentConfig) : null;


    // 可投放元素
    const targetElement = isWrapper ? e.target : getDroppableEle(e.target);

    if (!targetElement) return end();
    const targetComponentId = targetElement.getAttribute('data-component-id');

    if (isWrapper) {
        if (sourceComponentId) {
            dragPageAction.moveWrapper({
                sourceId: sourceComponentId,
                targetId: targetComponentId,
            });
            return end();
        }

        if (componentConfig) {
            dragPageAction.addWrapper({
                targetId: targetComponentId,
                node: componentConfig,
            });
            return end();
        }
    }

    // 放在自身上
    if (targetComponentId === sourceComponentId) return end();

    const {pageX, pageY, clientX, clientY} = e;

    const position = getDropPosition({
        e,
        pageX,
        pageY,
        clientX,
        clientY,
        targetElement,
        frameDocument: iframeDocument,
    });

    if (!position) return end();
    const accept = isDropAccept({
        e,
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
        // dragPageAction.setSelectedNodeId(sourceComponentId);
    }

    if (componentConfig) {
        dragPageAction.addNode({
            targetId: targetComponentId,
            node: componentConfig,
            ...position,
        });
        // dragPageAction.setSelectedNodeId(componentConfig.id);
    }

    end();
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
        e,
        draggingNode,
        pageConfig,
        targetComponentId,
        isBefore,
        isAfter,
        isChildren,
    } = options;

    if (!draggingNode) return false;

    const {isWrapper, toSetProps} = getDraggingNodeInfo({e, draggingNode});

    if (toSetProps) return true;

    if (isWrapper) return true;

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

// 查找所有的父级节点
export function findParentNodes(root, id) {
    const nodes = [];
    loopPageConfig(root, node => {
        const has = findNodeById(node, id);

        if (has) nodes.push(node);
    });

    return nodes;
}

// 根据id查找节点
export function findNodeById(root, id) {
    if (root.id === id) return root;

    for (let node of (root?.children || [])) {
        const result = findNodeById(node, id);
        if (result) return result;
    }

    // props中有可能也有节点
    for (let node of Object.values(root?.props || {})) {
        if (isComponentConfig(node)) {
            const result = findNodeById(node, id);
            if (result) return result;
        }
    }
    // wrapper中有节点
    for (let node of (root.wrapper || [])) {
        if (isComponentConfig(node)) {
            const result = findNodeById(node, id);
            if (result) return result;
        }
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
            targetElement,
            targetHeight: 0,
            targetWidth: 0,
            targetX: 0,
            targetY: 0,
            targetRect: {},
        },
    };

    const targetIsContainer = targetElement.getAttribute('data-is-container') === 'true';
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
        targetElement,
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
