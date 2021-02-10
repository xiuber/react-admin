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
                config: {
                    componentName: 'Form.Item',
                    props: {
                        label: '表单项',
                    },
                },
            },
        ],
    },
];
