export default [
    {
        title: '头像',
        subTitle: '头像 Avatar',
        children: [
            {
                title: '头像',
                renderPreview: true,
                config: {
                    componentName: 'Avatar',
                },
            },
        ],
    },
    {
        title: '徽标数',
        subTitle: '徽标数 Badge',
        children: [
            {
                title: '徽标数',
                renderPreview: true,
                config: {
                    componentName: 'Badge',
                    props: {
                        count: 5,
                    },
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '消息',
                            },
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '日历',
        subTitle: '日历 Calendar',
        children: [
            {
                title: '日历',
                renderPreview: true,
                previewZoom: .28,
                config: {
                    componentName: 'Calendar',
                },
            },
        ],
    },
    {
        title: '卡片',
        subTitle: '卡片 Card',
        children: [
            {
                title: '卡片',
                renderPreview: true,
                config: {
                    componentName: 'Card',
                },
            },
        ],
    },
    {
        title: '走马灯',
        subTitle: '走马灯 Carousel',
        children: [
            {
                title: '走马灯',
                renderPreview: true,
                config: {
                    componentName: 'Carousel',
                },
            },
        ],
    },
    {
        title: '折叠面板',
        subTitle: '折叠面板 Collapse',
        children: [
            {
                title: '折叠面板',
                renderPreview: true,
                config: {
                    componentName: 'Collapse',
                },
            },
        ],
    },
    {
        title: '评论',
        subTitle: '评论 Comment',
        children: [
            {
                title: '评论',
                renderPreview: true,
                config: {
                    componentName: 'Comment',
                },
            },
        ],
    },
    {
        title: '描述列表',
        subTitle: '描述列表 Descriptions',
        children: [
            {
                title: '描述列表',
                renderPreview: true,
                config: {
                    componentName: 'Descriptions',
                },
            },
        ],
    },
    {
        title: '空状态',
        subTitle: '空状态 Empty',
        children: [
            {
                title: '空状态',
                renderPreview: true,
                config: {
                    componentName: 'Empty',
                },
            },
        ],
    },
    {
        title: '图片',
        subTitle: '图片 Image',
        children: [
            {
                title: '图片',
                renderPreview: true,
                config: {
                    componentName: 'Image',
                },
            },
        ],
    },
    {
        title: '列表',
        subTitle: '列表 List',
        children: [
            {
                title: '列表',
                renderPreview: true,
                config: {
                    componentName: 'List',
                },
            },
        ],
    },
    {
        title: '气泡卡片',
        subTitle: '气泡卡片 Popover',
        children: [
            {
                title: '气泡卡片',
                renderPreview: true,
                config: {
                    componentName: 'Popover',
                },
            },
        ],
    },
    {
        title: '统计数值',
        subTitle: '统计数值 Statistic',
        children: [
            {
                title: '统计数值',
                renderPreview: true,
                config: {
                    componentName: 'Statistic',
                },
            },
        ],
    },
    {
        title: '表格',
        subTitle: '表格 Table',
        children: [
            {
                title: '表格',
                renderPreview: true,
                previewZoom: .8,
                config: {
                    componentName: 'Table',
                    props: {
                        pagination: false,
                        dataSource: [
                            {name: '张三', age: 25, operator: '修改'},
                            {name: '李四', age: 26, operator: '修改'},
                        ],
                    },
                    children: [ // 与 props.columns 对应
                        {componentName: 'Column', props: {title: '姓名', dataIndex: 'name'}},
                        {componentName: 'Column', props: {title: '年龄', dataIndex: 'age'}},
                        {componentName: 'Column', props: {title: '操作', dataIndex: 'operator'}},
                    ],
                },
            },
        ],
    },
    {
        title: '表格列',
        subTitle: '表格列 Column',
        children: [
            {
                title: '表格列',
                renderPreview: false,
                config: {
                    componentName: 'Column',
                    props: {
                        title: '新增列',
                        dataIndex: 'newColumn',
                    },
                },
            },
        ],
    },
    {
        title: '标签页',
        subTitle: '标签页 Tabs',
        children: [
            {
                title: '标签页',
                renderPreview: true,
                config: {
                    componentName: 'Tabs',
                },
            },
        ],
    },
    {
        title: '标签',
        subTitle: '标签 Tag',
        children: [
            {
                title: '标签',
                renderPreview: true,
                config: {
                    componentName: 'Tag',
                },
            },
        ],
    },
    {
        title: '时间轴',
        subTitle: '时间轴 Timeline',
        children: [
            {
                title: '时间轴',
                renderPreview: true,
                config: {
                    componentName: 'Timeline',
                },
            },
        ],
    },
    {
        title: '文字提示',
        subTitle: '文字提示 Tooltip',
        children: [
            {
                title: '文字提示',
                renderPreview: true,
                previewProps: {
                    visible: true,
                    getPopupContainer: e => e.parentNode,
                },
                previewWrapperStyle: {
                    paddingTop: 54,
                },
                config: {
                    componentName: 'Tooltip',
                    props: {
                        title: '文字提示',
                    },
                    children: [
                        {
                            componentName: 'Text',
                            props: {
                                text: '提示',
                            },
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '树形控件',
        subTitle: '树形控件 Tree',
        children: [
            {
                title: '树形控件',
                renderPreview: true,
                config: {
                    componentName: 'Tree',
                },
            },
        ],
    },
];
