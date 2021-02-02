import React, {useEffect} from 'react';
import {
    Form,
    Input,
    Radio,
    Tooltip,
} from 'antd';
import {
    PicCenterOutlined,
} from '@ant-design/icons';
import './style.less';

const displayOptions = [
    {value: 'inline', label: '内联布局', icon: <PicCenterOutlined/>},
    {value: 'flex', label: '弹性布局', icon: <PicCenterOutlined/>},
    {value: 'block', label: '块级布局', icon: <PicCenterOutlined/>},
    {value: 'inline-block', label: '内联块布局', icon: <PicCenterOutlined/>},
    {value: 'none', label: '内联块布局', icon: <PicCenterOutlined/>},
];

const flexDirectionOptions = [
    {value: 'row', label: '水平', tip: '水平方向，起点在左端'},
    {value: 'row-reverse', label: '逆水平', tip: '水平方向，起点在右端'},
    {value: 'column', label: '垂直', tip: '垂直方向，起点在上端'},
    {value: 'column-reverse', label: '逆垂直', tip: '垂直方向，起点在下端'},
];

const justifyContentOptions = [
    {value: 'flex-start', label: '左对齐', icon: <PicCenterOutlined/>},
    {value: 'flex-end', label: '右对齐', icon: <PicCenterOutlined/>},
    {value: 'center', label: '居中', icon: <PicCenterOutlined/>},
    {value: 'space-between', label: '两端对齐', icon: <PicCenterOutlined/>},
    {value: 'space-around', label: '横向平分', icon: <PicCenterOutlined/>},
];
const alignItemsOptions = [
    {value: 'flex-start', label: '上对齐', icon: <PicCenterOutlined/>},
    {value: 'flex-end', label: '下对齐', icon: <PicCenterOutlined/>},
    {value: 'center', label: '居中', icon: <PicCenterOutlined/>},
    {value: 'baseline', label: '基线对齐', icon: <PicCenterOutlined/>},
    {value: 'stretch', label: '沾满容器', icon: <PicCenterOutlined/>},
];
const flexWrapOptions = [
    {value: 'nowrap', label: '不换行'},
    {value: 'wrap', label: '正换行'},
    {value: 'wrap-reserve', label: '逆换行'},
];

function renderOptions(options) {
    return options.map((item, index) => {
        const {
            value,
            label,
            icon,
            tip,
        } = item;

        const isLast = index === options.length - 1;

        let title = tip || label;
        const la = icon || label;

        let labelNode = (
            <Tooltip placement={isLast ? 'topRight' : 'top'} title={`${title} ${value}`}>
                <div styleName="radioIcon">
                    {la}
                </div>
            </Tooltip>
        );

        return {
            value,
            label: labelNode,
        };
    });
}

const layout = {
    labelCol: {span: 8},
    wrapperCol: {span: 16},
};

export default function Layout(props) {
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        console.log(changedValues, allValues);
    }

    useEffect(() => {
        console.log('layout mount');
        return () => {
            console.log('layout unmount');
        };
    }, []);
    return (
        <div styleName="root">
            <Form
                form={form}
                name="layout"
                onValuesChange={handleChange}
            >

                <Form.Item
                    label="布局模式"
                    name="display"
                    colon={false}
                >
                    <Radio.Group
                        options={renderOptions(displayOptions)}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const display = getFieldValue('display');
                        if (display !== 'flex') return null;

                        return (
                            <>
                                <Form.Item
                                    label="主轴方向"
                                    name="flexDirection"
                                    colon={false}
                                >
                                    <Radio.Group
                                        options={renderOptions(flexDirectionOptions)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="主轴对齐"
                                    name="justifyContent"
                                    colon={false}
                                >
                                    <Radio.Group
                                        options={renderOptions(justifyContentOptions)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="辅轴对齐"
                                    name="alignItems"
                                    colon={false}
                                >
                                    <Radio.Group
                                        options={renderOptions(alignItemsOptions)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="换行方式"
                                    name="flexWrap"
                                    colon={false}
                                >
                                    <Radio.Group
                                        options={renderOptions(flexWrapOptions)}
                                        optionType="button"
                                        buttonStyle="solid"
                                    />
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{required: true, message: 'Please input your username!'}]}
                >
                    <Input/>
                </Form.Item>
            </Form>
        </div>
    );
}
