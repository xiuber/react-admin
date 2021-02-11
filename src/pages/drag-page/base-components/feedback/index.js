import modalImage from './modal.png';

export default [
    {
        title: '警告提示',
        subTitle: '警告提示 Alert',
        children: [
            {
                title: '警告提示',
                renderPreview: true,
                config: {
                    componentName: 'Alert',
                },
            },
        ],
    },
    {
        title: '抽屉',
        subTitle: '抽屉 Drawer',
        children: [
            {
                title: '抽屉',
                renderPreview: true,
                config: {
                    componentName: 'Drawer',
                },
            },
        ],
    },
    {
        title: '全局提示',
        subTitle: '全局提示 Message',
        children: [
            {
                title: '全局提示',
                renderPreview: true,
                config: {
                    componentName: 'Message',
                },
            },
        ],
    },
    {
        title: '对话框',
        subTitle: '对话框 Modal',
        children: [
            {
                title: '对话框',
                // renderPreview: true,
                image: modalImage,
                config: {
                    componentName: 'Modal',
                    props: {
                        title: '弹框标题',
                        maskClosable: false,
                        bodyStyle: {
                            padding: 0,
                        },
                    },
                    children: [
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {height: 200},
                                    },
                                },
                            ],
                        },
                        // {
                        //     componentName: 'ModalFooter',
                        //     props: {
                        //         className: 'ant-modal-footer',
                        //     },
                        //     children: [
                        //         {
                        //             componentName: 'Button',
                        //             children: [
                        //                 {
                        //                     componentName: 'Text',
                        //                     props: {
                        //                         text: '取消',
                        //                         isDraggable: false,
                        //                     },
                        //                 },
                        //             ],
                        //         },
                        //         {
                        //             componentName: 'Button',
                        //             props: {
                        //                 type: 'primary',
                        //             },
                        //             children: [
                        //                 {
                        //                     componentName: 'Text',
                        //                     props: {
                        //                         text: '确定',
                        //                         isDraggable: false,
                        //                     },
                        //                 },
                        //             ],
                        //         },
                        //     ],
                        // },
                    ],
                },
            },
            {
                title: '对话框底部',
                renderPreview: true,
                previewStyle: {width: '100%'},
                previewZoom: .68,
                config: {
                    componentName: 'ModalFooter',
                    props: {
                        className: 'ant-modal-footer customer-modal-footer',
                    },
                    children: [
                        {
                            componentName: 'Button',
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '取消',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'Button',
                            props: {
                                type: 'primary',
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '确定',
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
        title: '通知提醒框',
        subTitle: '通知提醒框 Notification',
        children: [
            {
                title: '通知提醒框',
                renderPreview: true,
                config: {
                    componentName: 'Notification',
                },
            },
        ],
    },
    {
        title: '气泡确认框',
        subTitle: '气泡确认框 Popconfirm',
        children: [
            {
                title: '气泡确认框',
                renderPreview: true,
                config: {
                    componentName: 'Popconfirm',
                },
            },
        ],
    },
    {
        title: '进度条',
        subTitle: '进度条 Progress',
        children: [
            {
                title: '进度条',
                renderPreview: true,
                config: {
                    componentName: 'Progress',
                },
            },
        ],
    },
    {
        title: '结果',
        subTitle: '结果 Result',
        children: [
            {
                title: '结果',
                renderPreview: true,
                config: {
                    componentName: 'Result',
                },
            },
        ],
    },
    {
        title: '骨架屏',
        subTitle: '骨架屏 Skeleton',
        children: [
            {
                title: '骨架屏',
                renderPreview: true,
                config: {
                    componentName: 'Skeleton',
                },
            },
        ],
    },
    {
        title: '加载中',
        subTitle: '加载中 Spin',
        children: [
            {
                title: '加载中',
                renderPreview: true,
                config: {
                    componentName: 'Spin',
                },
            },
        ],
    },
];
