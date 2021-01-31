import {v4 as uuid} from 'uuid';

export async function getComponents(category) {
    return [
        {
            id: uuid(),
            title: '表单',
            components: [
                {
                    id: uuid(),
                    title: '输入框输入框输入框输入框',
                    subTitle: '输入框 Input',
                    components: [
                        {
                            id: uuid(),
                            title: '输入框',
                            image: 'https://gw.alipayobjects.com/zos/alicdn/xS9YEJhfe/Input.svg',
                            config: {
                                __config: {
                                    isContainer: false,
                                },
                                componentName: 'Input',
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
                                componentName: 'Input',
                            },
                        },
                    ],
                },
                {
                    id: uuid(),
                    title: '下拉框',
                    subTitle: '下拉框 Select',
                    components: [
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
                                    options: [
                                        {value: 1, label: '下拉项'},
                                    ],
                                },
                            },
                        },
                    ],
                },
            ]
        },
    ];
}

export async function getStores() {
    return [
        {value: '1', label: '分类1'},
        {value: '2', label: '分类2'},
        {value: '3', label: '分类3'},
    ];
}
