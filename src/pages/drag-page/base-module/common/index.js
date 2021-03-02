export default [
    {
        title: '工具条',
        subTitle: '工具条 ToolBar',
        children: [
            {
                title: '工具条',
                renderPreview: true,
                config: {
                    componentName: 'ToolBar',
                    children: [
                        {
                            componentName: 'Button',
                            props: {
                                type: 'primary',
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '添加',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'Button',
                            props: {
                                type: 'primary',
                                danger: true,
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '批量删除',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'Button',
                            props: {
                                type: 'default',
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '导出',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
];
