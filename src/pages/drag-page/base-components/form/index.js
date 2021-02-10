import {getComponentConfig} from 'src/pages/drag-page/component-config';

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
                                    props: {
                                        placeholder: '请输入姓名',
                                    },
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
                                        placeholder: '请输入年龄',
                                        min: 0,
                                        step: 1,
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
                            tip: '请拖入表单元素',
                        },
                        childrenDraggable: false, // 子节点不可拖拽
                        dropAccept: options => {
                            const {draggingNode} = options;
                            const nodeConfig = getComponentConfig(draggingNode?.componentName);

                            return nodeConfig?.isFormElement;
                        },
                        hooks: {
                            beforeAddChildren: (options) => {
                                const {node, targetNode} = options;

                                if (!node) return;

                                // 清空 相当于替换元素了
                                node.children = [];

                                if (targetNode?.componentName === 'Switch') {
                                    if (!node.props) node.props = {};

                                    node.props.valuePropName = 'checked';
                                }

                            },
                        },
                        componentDisplayName: ({node}) => {
                            const {componentName, props = {}} = node;
                            const {label} = props;

                            if (!label) return componentName;

                            return `${componentName} ${label}`;
                        },
                    },
                    componentName: 'Form.Item',
                    props: {
                        label: '表单项',
                    },
                },
            },
        ],
    },
];
