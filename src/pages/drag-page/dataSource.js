import {v4 as uuid} from 'uuid';
import baseComponents from './base-components';

// __config 说明
// eslint-disable-next-line
const __config = {
    componentId: '', // 渲染时组件id
    componentDesc: '', // 组件描述
    componentType: '', // 组件类型，详见 getComponent方法，默认 drag-page/components -> antd -> html
    draggable: false, // 组件是否可拖拽 默认 true
    isContainer: false, // 组件是否是容器，默认true，如果是容器，则可托放入子节点
    withWrapper: true, // 是否需要拖拽包裹元素，默认 false，有些组件拖拽无效，需要包裹一下
    wrapperStyle: {display: 'inline-block'}, // 拖拽包裹元素样式，一般用来设置 display width height 等
    dropAccept: ['Text'], // 可拖入组件，默认 任意组件都可放入
};

export async function getComponents(category) {
    if (category === 'base') return baseComponents;

    return [
        {
            id: uuid(),
            title: '表单',
            children: [
                {
                    id: uuid(),
                    title: '输入框输入框输入框输入框',
                    subTitle: '输入框 Input',
                    children: [
                        {
                            id: uuid(),
                            title: '输入框',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                __config: {
                                    isContainer: false,
                                },
                                componentName: 'Input',
                                props: {
                                    placeholder: '请输入',
                                },
                            },
                        },
                        {
                            id: uuid(),
                            title: '搜索框',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                __config: {
                                    isContainer: false,
                                    withWrapper: true,
                                    wrapperStyle: {
                                        display: 'inline-block',
                                        width: '100%',
                                    },
                                },
                                componentName: 'Input.Search',
                                props: {
                                    placeholder: '请搜索',
                                },
                            },
                        },
                        {
                            id: uuid(),
                            title: '文本域',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                __config: {
                                    isContainer: false,
                                },
                                componentName: 'Input.TextArea',
                                props: {
                                    placeholder: '请输入',
                                },
                            },
                        },
                    ],
                },
                {
                    id: uuid(),
                    title: '下拉框',
                    subTitle: '下拉框 Select',
                    children: [
                        {
                            id: uuid(),
                            title: '下拉框' + category,
                            image: 'https://gw.alipayobjects.com/zos/alicdn/_0XzgOis7/Select.svg',
                            config: {
                                __config: {
                                    isContainer: false,
                                },
                                componentName: 'Select',
                                props: {
                                    style: {width: '100%'},
                                    placeholder: '请选择',
                                    options: [
                                        {value: '1', label: '下拉项1'},
                                        {value: '2', label: '下拉项2'},
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ];
}

export async function getStores() {
    return [
        {value: 'base', label: '基础组件'},
        {value: 'page', label: '基础页面'},
        {value: 'model', label: '基础模块'},
        {value: '1', label: '自定义分类1'},
        {value: '2', label: '自定义分类2'},
    ];
}
