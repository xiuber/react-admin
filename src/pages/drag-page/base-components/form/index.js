import React from 'react';
import {Form, Input} from 'antd';

const formChildren = [
    {
        componentName: 'Form.Item',
        props: {
            label: '姓名',
            name: 'name',
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

const commonProps = {
    initialValues: {
        name: '张三',
    },
    onFinish: 'values => alert(JSON.stringify(values))',
    onValuesChange: '(changeValues, allValues) => console.log(allValues)',
};

export default [
    {
        title: '表单',
        subTitle: '表单 Form',
        children: [
            {
                title: '水平表单',
                renderPreview: true,
                config: {
                    componentName: 'Form',
                    props: {
                        layout: 'inline',
                        name: 'inline',
                        ...commonProps,
                    },
                    children: formChildren,
                },
            },
            {
                title: '垂直表单',
                renderPreview: true,
                config: {
                    componentName: 'Form',
                    props: {
                        name: 'demo',
                        ...commonProps,
                    },
                    children: formChildren,
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
