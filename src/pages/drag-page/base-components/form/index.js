import React from 'react';

export default [
    {
        title: '表单',
        subTitle: '表单 Form',
        children: [
            {
                title: '垂直表单',
                renderPreview: true,
                config: {
                    componentName: 'Form',
                    children: [
                        {
                            componentName: 'Form.Item',
                            props: {
                                label: '姓名',
                            },
                            children: [
                                {
                                    componentName: 'Input',
                                },
                            ],
                        },
                        {
                            componentName: 'Form.Item',
                            props: {
                                label: '年龄',
                            },
                            children: [
                                {
                                    componentName: 'InputNumber',
                                    props: {
                                        style: {width: '100%'},
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
            {
                title: '表单项',
                // hiddenInStore: true,
                config: {
                    __config: {
                        withHolder: true,
                        holderProps: {
                            style: {height: 50},
                            tip: '请拖入表单元素',
                        },
                        childrenDraggable: false, // 子节点不可拖拽
                        dropAccept: options => {
                            const {draggingNode} = options;

                            return draggingNode?.__config?.isFormElement;
                        },
                        // hooks: {
                        //     beforeAdd: (options) => {
                        //         const {node} = options;
                        //         if (!node) return;
                        //     },
                        // },
                        componentDisplayName: ({node, pageConfig}) => {
                            const {componentName, props = {}} = node;
                            const {label} = props;

                            if (!label) return componentName;

                            return `${componentName} ${label}`;
                        },
                    },
                    componentName: 'Form.Item',
                },
            },
        ],
    },
];
