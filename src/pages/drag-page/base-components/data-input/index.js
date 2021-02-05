import React from 'react';
import {Select} from 'antd';

export default [
    {
        title: '自动完成',
        subTitle: '自动完成 AutoComplete',
        children: [
            {
                title: '自动完成',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                        actions: {
                            onSearch: value => args => {
                                const {
                                    // pageConfig,
                                    dragPageAction,
                                    node,
                                } = args;
                                if (!node.props) node.props = {};

                                node.props.options = [
                                    {value: `${value}@qq.com`},
                                    {value: `${value}@163.com`},
                                    {value: `${value}@qiye.com`},
                                ];

                                dragPageAction.render();
                            },
                        },
                    },
                    componentName: 'AutoComplete',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请输入',
                        options: [
                            {value: '@qq.com'},
                            {value: '@163.com'},
                            {value: '@qiye.com'},
                        ],
                    },
                },
            },
        ],
    },
    {
        title: '级联选择',
        subTitle: '级联选择 Cascader',
        children: [
            {
                title: '级联选择',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Cascader',
                },
            },
        ],
    },
    {
        title: '多选框',
        subTitle: '多选框 Checkbox',
        children: [
            {
                title: '多选框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Checkbox',
                },
            },
        ],
    },
    {
        title: '日期选择框',
        subTitle: '日期选择框 DatePicker',
        children: [
            {
                title: '日期选择框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'DatePicker',
                },
            },
        ],
    },
    {
        title: '表单',
        subTitle: '表单 Form',
        children: [
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
                    },
                    componentName: 'Form.Item',
                },
            },
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
        ],
    },
    {
        title: '输入框',
        subTitle: '输入框 Input',
        children: [
            {
                title: '输入框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Input',
                },
            },
            {
                title: '数字输入框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                        withWrapper: true,
                        wrapperStyle: {display: 'inline-block'},
                    },
                    componentName: 'InputNumber',
                },
            },
        ],
    },
    {
        title: '提及',
        subTitle: '提及 Mentions',
        children: [
            {
                title: '提及',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Mentions',
                },
            },
        ],
    },
    {
        title: '单选框',
        subTitle: '单选框 Radio',
        children: [
            {
                title: '单选框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Radio',
                },
            },
        ],
    },
    {
        title: '评分',
        subTitle: '评分 Rate',
        children: [
            {
                title: '评分',
                renderPreview: true,
                previewZoom: .7,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Rate',
                },
            },
        ],
    },
    {
        title: '选择器',
        subTitle: '选择器 Select',
        children: [
            {
                title: '选择器',
                renderPreview: node => {
                    const container = {current: null};
                    return (
                        <div
                            ref={container}
                            style={{position: 'relative', height: 100, width: '100%'}}
                        >
                            <Select
                                {...node.props}
                                getPopupContainer={() => container.current}
                                open
                            />
                        </div>
                    );
                },
                // previewStyle: {width: '100%'},
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Select',
                    props: {
                        placeholder: '请选择',
                        options: [
                            {value: '1', label: '下拉项1'},
                            {value: '2', label: '下拉项2'},
                        ],
                        style: {width: '100%'},
                    },
                },
            },
        ],
    },
    {
        title: '滑动输入条',
        subTitle: '滑动输入条 Slider',
        children: [
            {
                title: '滑动输入条',
                renderPreview: true,
                previewStyle: {width: '100%'},
                // previewWrapperStyle: {background: 'red'},
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Slider',
                    props: {
                        value: 50,
                    },
                },
            },
        ],
    },
    {
        title: '开关',
        subTitle: '开关 Switch',
        children: [
            {
                title: '开关',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Switch',
                },
            },
        ],
    },
    {
        title: '时间选择框',
        subTitle: '时间选择框 TimePicker',
        children: [
            {
                title: '时间选择框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                        withWrapper: true,
                        wrapperStyle: {display: 'inline-block'},
                    },
                    componentName: 'TimePicker',
                },
            },
        ],
    },
    {
        title: '穿梭框',
        subTitle: '穿梭框 Transfer',
        children: [
            {
                title: '穿梭框',
                renderPreview: true,
                previewZoom: .28,
                config: {
                    __config: {
                        isContainer: false,
                        withWrapper: true,
                    },
                    componentName: 'Transfer',
                },
            },
        ],
    },
    {
        title: '树选择',
        subTitle: '树选择 TreeSelect',
        children: [
            {
                title: '树选择',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'TreeSelect',
                },
            },
        ],
    },
    {
        title: '上传',
        subTitle: '上传 Upload',
        children: [
            {
                title: '上传',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Upload',
                },
            },
        ],
    },
];
