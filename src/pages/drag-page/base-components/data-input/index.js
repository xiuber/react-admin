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
                        actions: {
                            onSearch: value => args => {
                                const {
                                    // pageConfig,
                                    dragPageAction,
                                    node,
                                } = args;
                                if (!node.props) node.props = {};

                                if (node?.props?.__options?.length !== node.props.options?.length) {

                                    node.props.__options = node.props.options.map(item => ({...item}));
                                }
                                node.props.options = node.props.__options.map(item => {

                                    return {value: `${value}${item.value}`};
                                });

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
                        withWrapper: true,
                        wrapperStyle: {
                            display: 'inline-block',
                            position: 'relative',
                        },
                    },
                    componentName: 'Cascader',
                    props: {
                        placeholder: '请选择',
                        options: [
                            {
                                label: '北京',
                                value: 'beijing',
                                children: [
                                    {
                                        label: '石景山',
                                        value: 'shijingshan',
                                        children: [
                                            {
                                                label: '苹果园',
                                                value: 'pingguoyuan',
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                label: '江苏',
                                value: 'jiangsu',
                                children: [
                                    {
                                        label: '南京',
                                        value: 'nanjing',
                                        children: [
                                            {
                                                label: '中华门',
                                                value: 'zhonghuamen',
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
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
                previewProps: {checked: true},
                config: {
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
                    componentName: 'DatePicker',
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
                    componentName: 'Input',
                    props: {
                        placeholder: '请输入',
                    },
                },
            },
            {
                title: '数字输入框',
                renderPreview: true,
                config: {
                    __config: {
                        withWrapper: true,
                        wrapperStyle: {display: 'inline-block'},
                    },
                    componentName: 'InputNumber',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请输入数字',
                    },
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
                    componentName: 'Mentions',
                    props: {
                        placeholder: '请输入',
                    },
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
                previewProps: {checked: true},
                config: {
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
                previewProps: {allowHalf: true, value: 2.5},
                previewZoom: .7,
                config: {
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
                        // 无论是否添加wrapper，下拉选择项了之后，就无法拖拽了
                        // withWrapper: true,
                        // wrapperStyle: {display: 'inline-block'},
                    },
                    componentName: 'Select',
                    props: {
                        placeholder: '请选择',
                        allowClear: true,
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
                    componentName: 'TreeSelect',
                    props: {
                        style: {width: '100%'},
                        placeholder: '请选择',
                    },
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
                        childrenDraggable: false,
                    },
                    componentName: 'Upload',
                    children: [
                        {
                            componentName: 'Button',
                            children: [
                                {
                                    componentName: 'UploadOutlined',
                                    props: {
                                        style: {
                                            marginRight: 8,
                                        },
                                    },
                                },
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '请选择文件',
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
].map(item => {
    const {children} = item;
    children.forEach(node => {
        const {config} = node;
        if (!config.__config) config.__config = {};

        // 都为表单元素，可放入 Form.Item 中
        config.__config.isFormElement = true;

        // 默认 isContainer = false
        if (!('isContainer' in config.__config)) config.__config.isContainer = false;
    });
    return item;
});
