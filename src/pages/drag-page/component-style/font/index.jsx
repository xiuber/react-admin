import React, { useEffect } from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Row,
    Col,
} from 'antd';
import {
    PicCenterOutlined,
} from '@ant-design/icons';
import RadioGroup from '../radio-group';
import SliderInput from '../slider-input';
import './style.less';
import UnitInputItem from '../unit-input-item';

const textAlignOptions = [
    { value: 'left', label: '左对齐', icon: <PicCenterOutlined /> },
    { value: 'center', label: '居中对齐', icon: <PicCenterOutlined /> },
    { value: 'right', label: '右对齐', icon: <PicCenterOutlined /> },
    { value: 'justify', label: '两端对齐', icon: <PicCenterOutlined /> },
];

export default function Font(props) {
    const { value, onChange = () => undefined } = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);
    }, [value]);
    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="font"
            >
                <Row>
                    <Col span={14}>
                        <Form.Item
                            label="字符"
                            name="fontWeight"
                            colon={false}
                        >
                            <Select
                                placeholder="粗细"
                                options={[
                                    { value: 'normal', label: '正常' },
                                    { value: 'bolder', label: '粗体' },
                                    { value: '100', label: '细体' },
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ paddingLeft: 8 }}>
                        <Form.Item
                            name="fontSize"
                            colon={false}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                min={12}
                                step={1}
                                placeholder="字号"
                                formatter={value => value ? `${value}px` : value}
                                parser={value => value.replace('px', '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={14} style={{ paddingLeft: 34 }}>
                        <Form.Item
                            name="color"
                            colon={false}
                        >
                            <Input placeholder="颜色" />
                        </Form.Item>
                    </Col>
                    <Col span={10} style={{ paddingLeft: 8 }}>
                        <UnitInputItem
                            name="lineHeight"
                            colon={false}
                            placeholder="行距"
                            form={form}
                            handleChange={handleChange}
                        />
                    </Col>
                </Row>

                <Form.Item
                    label="对齐"
                    name="textAlign"
                    colon={false}
                >
                    <RadioGroup
                        options={textAlignOptions}
                        form={form}
                        handleChange={handleChange}
                    />
                </Form.Item>
                <Form.Item
                    label="透明"
                    name="opacity"
                    initialValue={1}
                    colon={false}
                >
                    <SliderInput suffix="%" percent />
                </Form.Item>
            </Form>
        </div>
    );
}
