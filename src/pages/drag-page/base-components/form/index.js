import React from 'react';
import {Form, Input} from 'antd';
import InlineFormImage from './InlineForm.png';
import FormImage from './Form.png';

const formChildren = [
    {
        componentName: 'Form.Item',
        props: {
            label: '姓名',
            name: 'name',
            rules: [
                {required: true, message: '请输入姓名！'},
            ],
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
            name: 'age',
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
    {
        componentName: 'Form.Item',
        props: {
            label: '工作',
            name: 'job',
        },
        children: [
            {
                componentName: 'Select',
                props: {
                    style: {width: '100%'},
                    placeholder: '请选择工作',
                    options: [
                        {value: '1', label: '选项1'},
                        {value: '2', label: '选项2'},
                    ],
                },
            },
        ],
    },
    {
        componentName: 'Form.Item',
        props: {
            label: '入职日期',
            name: 'joinTime',
        },
        children: [
            {
                componentName: 'DatePicker',
                props: {
                    style: {width: '100%'},
                    placeholder: '请选择入职日期',
                },
            },
        ],
    },
    {
        componentName: 'Form.Item',
        children: [
            {
                componentName: 'Button',
                props: {
                    type: 'primary',
                    htmlType: 'submit',
                },
                children: [
                    {
                        componentName: 'Text',
                        props: {text: '提交', isDraggable: false},
                    },
                ],
            },
            {
                componentName: 'Button',
                children: [
                    {
                        componentName: 'Text',
                        props: {text: '重置', isDraggable: false},
                    },
                ],
            },
        ],
    },
];

const formProps = {
    onFinish: 'values => alert(JSON.stringify(values))',
    // onValuesChange: '(changeValues, allValues) => console.log(allValues)',
};

export default [
    {
        title: '表单',
        subTitle: '表单 Form',
        children: [
            {
                title: '水平表单',
                image: InlineFormImage,
                previewZoom: .7,
                config: {
                    componentName: 'Form',
                    props: {
                        layout: 'inline',
                        name: 'inline',
                        ...formProps,
                    },
                    children: [
                        {
                            componentName: 'InlineForm',
                            children: formChildren,
                        },
                    ],
                },
            },
            {
                title: '垂直表单',
                image: FormImage,
                config: {
                    componentName: 'Form',
                    props: {
                        name: 'demo',
                        ...formProps,
                    },
                    children: formChildren.map((item, index) => {
                        const isLast = formChildren.length - 1 === index;
                        const props = {...(item.props || {})};
                        if (isLast) {
                            props.style = {paddingLeft: '70px'};
                        } else {
                            props.labelCol = {flex: '70px'};
                        }

                        return {...item, props};
                    }),
                },
            },
            {
                title: '表单项',
                renderPreview: (
                    <Form>
                        <Form.Item
                            label="名称"
                        >
                            <Input placeholder="请输入"/>
                        </Form.Item>
                    </Form>
                ),
                config: {
                    componentName: 'Form.Item',
                    props: {
                        label: '名称',
                    },
                    children: [
                        {
                            componentName: 'Input',
                            props: {
                                placeholder: '请输入',
                            },
                        },
                    ],
                },
            },
        ],
    },
];
