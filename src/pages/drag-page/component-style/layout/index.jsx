import React, {useEffect} from 'react';
import {
    Form,
    Input,
} from 'antd';
import {
    PicCenterOutlined,
} from '@ant-design/icons';
import RadioGroup from '../radio-group';
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
const paddingMarginFields = [
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
];

export default function Layout(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        // 过滤空值 让父级统一过滤
        // const values = Object.entries(allValues).reduce((prev, curr) => {
        //     const [key, value] = curr;
        //     if (value !== '' && value !== undefined) prev[key] = value;
        //
        //     return prev;
        // }, {});
        console.log('values', allValues);
        // TODO paddingTop 等 去空格 、'100' => 100 纯数字，转数字
        // 父级统一处理
        // 如果是数字开头
        //      纯数字符串 转 数字
        //      （其他）带单位的 去空格
        onChange(allValues);
    }

    useEffect(() => {
        form.setFieldsValue(value);
    }, [value]);
    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="layout"
            >

                <Form.Item
                    label="布局模式"
                    name="display"
                    colon={false}
                >
                    <RadioGroup
                        options={displayOptions}
                        form={form}
                        handleChange={handleChange}
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
                                    <RadioGroup
                                        options={flexDirectionOptions}
                                        form={form}
                                        handleChange={handleChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="主轴对齐"
                                    name="justifyContent"
                                    colon={false}
                                >
                                    <RadioGroup
                                        options={justifyContentOptions}
                                        form={form}
                                        handleChange={handleChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="辅轴对齐"
                                    name="alignItems"
                                    colon={false}
                                >
                                    <RadioGroup
                                        options={alignItemsOptions}
                                        form={form}
                                        handleChange={handleChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    label="换行方式"
                                    name="flexWrap"
                                    colon={false}
                                >
                                    <RadioGroup
                                        options={flexWrapOptions}
                                        form={form}
                                        handleChange={handleChange}
                                    />
                                </Form.Item>
                            </>
                        );
                    }}
                </Form.Item>
                <div style={{padding: '0 5px'}}>
                    <div styleName="contentBox">
                        {paddingMarginFields.map(item => (
                            <div styleName={`paddingMargin ${item}`}>
                                <Form.Item
                                    name={item}
                                    noStyle
                                    colon={false}
                                >
                                    <Input autocomplete="off" step={1}/>
                                </Form.Item>
                            </div>
                        ))}

                        <div styleName="widthHeight">
                            <Form.Item
                                label="宽"
                                name="width"
                                colon={false}
                            >
                                <Input style={{width: 70, marginRight: 8}}/>
                            </Form.Item>
                            <Form.Item
                                label="高"
                                name="height"
                                colon={false}
                            >
                                <Input style={{width: 70}}/>
                            </Form.Item>
                        </div>
                    </div>
                </div>
            </Form>
        </div>
    );
}
