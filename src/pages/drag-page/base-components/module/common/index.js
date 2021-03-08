import from from '../../form';

export default [
    {
        title: '查询条件',
        subTitle: '查询条件 QueryBar',
        children: [
            {
                title: '查询条件',
                image: from[0].children[0].image,
                config: {
                    componentName: 'QueryBar',
                    children: [
                        from[0].children[0].config,
                    ],
                },
            },
        ],
    },
    {
        title: '工具条',
        subTitle: '工具条 ToolBar',
        children: [
            {
                title: '工具条',
                renderPreview: true,
                previewZoom: .5,
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
    {
        title: '图片验证码',
        subTitle: '图片验证码 ImageCode',
        children: [
            {
                title: '图片验证码',
                config: {
                    componentName: 'ImageCode',
                },
            },
        ],
    },
    {
        title: '短信验证码',
        subTitle: '短信验证码 MessageCode',
        children: [
            {
                title: '短信验证码',
                config: {
                    componentName: 'MessageCode',
                },
            },
        ],
    },
];
