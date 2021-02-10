import React from 'react';
import {AppstoreOutlined, DropboxOutlined, MacCommandOutlined} from '@ant-design/icons';
import {v4 as uuid} from 'uuid';
import {cloneDeep} from 'lodash';
import base from './base';
import common from './common';
import dataInput from './data-input';
import dataShow from './data-show';
import form from './form';
import feedback from './feedback';
import other from './other';
import NodeRender from 'src/pages/drag-page/iframe-render/node-render/NodeRender';

let baseComponents = [
    {title: '默认', children: base},
    {title: '通用', children: common},
    {title: '表单', children: form},
    {title: '数据输入', children: dataInput},
    {title: '数据展示', children: dataShow},
    {title: '反馈', children: feedback},
    {title: '其他', children: other},
];

// __config 说明
const defaultConfig = {
    // renderComponentName: '', // 指定渲染使用组件，比如 PageContent 并不存在，可以指定使用div渲染
    // componentId: undefined, // 渲染时组件id
    // componentDesc: undefined, // 组件描述
    // componentType: undefined, // 组件类型，详见 getComponent方法，默认 drag-page/components -> antd -> html
    // componentDisplayName: '', // 组件展示名称，默认 componentName，string 字符串 || ReactNode 节点 || ({node, pageConfig}) => name 函数返回值
    // renderAsDisplayName: '', // 是否渲染组件，作为componentDisplayName
    draggable: true, // 组件是否可拖拽 默认 true
    isContainer: true, // 组件是否是容器，默认true，如果是容器，则可托放入子节点
    withWrapper: false, // 是否需要拖拽包裹元素，默认 false，有些组件拖拽无效，需要包裹一下
    // wrapperStyle: undefined, // {display: 'inline-block'}, // 拖拽包裹元素样式，一般用来设置 display width height 等
    // dropAccept: undefined, // ['Text'] || function, // 可拖入组件，默认 任意组件都可放入
    // 如果某个组件必须存在子元素，可以添加 withHolder: true, 提示用户必须拖入子元素，比如 Form.Item，但是div不要设置true，有些情况div不需要子元素
    withHolder: false, // 当没有子组件的时候，是否显示holder 默认 false ，true && isContainer 显示
    // holderProps: {}, //
    childrenDraggable: true, // 子节点是否可拖拽，
    // actions: { // 事件 event:组件事件原始数据 options: 自定义数据
    //     onSearch: event => options => {
    //
    //         const {
    //             pageConfig, // 页面整体配置
    //             dragPageAction, // 页面action
    //             node, // 当前组件配置
    //         } = options;
    //         if (!node.props) node.props = {};
    //
    //         node.props.options = [
    //             {event: `${event}@qq.com`},
    //             {event: `${event}@163.com`},
    //             {event: `${event}@qiye.com`},
    //         ];
    //
    //         dragPageAction.render(); // props改变了，重新出发页面渲染
    //     },
    // },
    hooks: {
        // beforeMove // 返回false， 不允许移动
        // afterMove

        // beforeAdd, // 返回false， 不添加
        // afterAdd,

        // beforeDelete,  // 返回false，不删除
        // afterDelete,

        // beforeAddChildren // 返回false，不允许添加
        // afterAddChildren

        // beforeDeleteChildren // 返回false，不允许删除
        // afterDeleteChildren
    },
};

const componentConfigMap = {};
const componentIconMap = {};

baseComponents.forEach(item => {
    const {title} = item;
    item.children.forEach(it => {
        const {subTitle} = it;
        it.children.forEach(i => {
            const {title: t, config, icon} = i;
            const {__config = defaultConfig, componentName, children} = config;

            if (componentConfigMap[componentName]) {
                console.info(`${title} > ${subTitle} > ${t} componentName 已经被使用！
注意：相同的componentName将使用相同的__config、icon配置，若想区分，请在components中定义别名组件，比如PageContent！或者使用 __config.renderComponentName指定渲染组件`);
            }
            componentConfigMap[componentName] = __config;
            componentIconMap[componentName] = icon;
            check__config(children, `${title} > ${subTitle} > ${t}`);
        });
    });
});

function check__config(children, position) {
    if (!children?.length) return;

    const loop = nodes => {
        for (let node of nodes) {
            if ('__config' in node) {
                const {componentName} = node;
                console.error(`${position} 中深层组件「${componentName}」配置中不要写「__config」!
Schema 源码编辑，或存库之后，会导致深层「__config」属性丢失，可以考虑编写特殊组件，使用props控制行为`);
                return;
            }
            if (node?.children?.length) loop(node?.children);
        }
    };
    loop(children);
}

// 两个forEach 无法合并， setDefaultOptions 中 用到了 componentConfigMap
baseComponents.forEach(item => {
    item.id = uuid();
    item.children = setDefaultOptions(item.children);
});

export default baseComponents;

export const targetOptions = [
    {value: '_blank', label: '新页'},
    {value: '_self', label: '当前页'},
    {value: '_parent', label: '父级页'},
    {value: '_top', label: 'top'},
];

export function getComponentDisplayName(node, render) {
    if (!node) return '';

    const {__config, componentName} = node;
    const {componentDisplayName, renderAsDisplayName} = __config;

    let name = componentDisplayName || componentName;

    if (typeof name === 'function') name = name({node});

    if (render && renderAsDisplayName) {
        name = (
            <div style={{display: 'inline-block', maxWidth: 200}}>
                <NodeRender config={node}/>
            </div>
        );
    }

    return name;
}

// 获取组件配置 __config 并设置默认值
export function getComponentConfig(node) {
    const {componentName} = node;
    const config = componentConfigMap[componentName] || {};

    return {...defaultConfig, ...config};
}

export function getComponentIcon(node = {}, isContainer = true) {
    const {componentName} = node;

    const icon = componentIconMap[componentName];
    if (!icon) return isContainer ? <DropboxOutlined/> : <MacCommandOutlined/>;
    return icon;
}

export function removeComponentConfig(nodes, leaveComponentId) {
    const dataSource = (cloneDeep(Array.isArray(nodes) ? nodes : [nodes]));

    const loop = nodes => nodes.forEach(node => {
        if (leaveComponentId && node) {

            // 调整node字段顺序，保证 __id 在首位
            const keys = Object.keys(node);
            keys.unshift('__id');
            keys.forEach(key => {
                let value = node[key];
                Reflect.deleteProperty(node, key);

                if (key === '__id') value = node?.__config?.componentId;
                node[key] = value;
            });
        }

        // 删除__config
        Reflect.deleteProperty(node, '__config');

        // 删除 props.key
        if (node?.props?.key) Reflect.deleteProperty(node.props, 'key');

        if (node.children) loop(node.children);
    });

    loop(dataSource);

    return dataSource[0];
}


// 设置组件配置 __config 重新设置 node.__config.componentId
export function setComponentDefaultOptions(componentNode) {
    const dataSource = !Array.isArray(componentNode) ? [componentNode] : componentNode;

    const loop = nodes => {
        nodes.forEach(node => {
            // node.__id 为某些操作下的保留 componentId
            const componentId = node?.__config?.componentId || node.__id;

            Reflect.deleteProperty(node, '__id');

            // 直接覆盖__config
            node.__config = getComponentConfig(node);

            // componentId 不要替换，modal 连接 需要稳定id
            node.__config.componentId = componentId || uuid();

            if (node.children?.length) {
                loop(node.children);
            }
        });
    };

    loop(dataSource);

    return componentNode;
}

// 组件库 设置默认值
export function setDefaultOptions(nodes) {
    if (!nodes?.length) return nodes;

    nodes.forEach(node => {
        if (!node.id) node.id = uuid();

        (node?.children || []).forEach(node => {
            if (!node.id) node.id = uuid();
            if (!node.icon) node.icon = <AppstoreOutlined/>;

            if (node.config) setComponentDefaultOptions(node.config);
        });
    });

    return nodes;
}

