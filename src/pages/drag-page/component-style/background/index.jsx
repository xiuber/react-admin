import React, { useEffect } from 'react';
import {
    Form,
    Input,
    Row,
    Col,
} from 'antd';
import RadioGroup from '../radio-group';
import './style.less';
import UnitInput from '../unit-input';
import QuickPosition from '../quick-position';

const backgroundSizeOptions = [
    { value: 'width height', label: '宽高' },
    { value: 'contain', label: '等比填充' },
    { value: 'cover', label: '等比覆盖' },
];
const layout = {
    labelCol: { flex: '58px' },
    wrapperCol: { flex: 1 },
};
export default function Background(props) {
    const { value, onChange = () => undefined } = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {

        console.log('allValues', JSON.stringify(allValues, null, 4));
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
                name="background"
            >
                <Form.Item
                    label="填充颜色"
                    name="backgroundColor"
                    colon={false}
                >
                    <Input
                        allowClear
                        placeholder='background-color'
                    />
                </Form.Item>
                <Form.Item
                    {...layout}
                    label="背景图片"
                    name="backgroundImage"
                    colon={false}
                >
                    <Input
                        allowClear
                        placeholder='background-image'
                    />
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                        const backgroundImage = getFieldValue('backgroundImage');
                        if (!backgroundImage) return null;
                        return (
                            <>
                                <Form.Item
                                    {...layout}
                                    label="尺寸"
                                    name="backgroundSize"
                                    colon={false}
                                >
                                    <RadioGroup options={backgroundSizeOptions} />
                                </Form.Item>
                                <Form.Item shouldUpdate noStyle>
                                    {({ getFieldValue }) => {
                                        const backgroundSize = getFieldValue('backgroundSize');
                                        if (backgroundSize !== 'width height') return null;

                                        return (
                                            <Row styleName="backgroundSize" style={{ paddingLeft: layout.labelCol.flex }}>
                                                <Col span={12}>
                                                    <Form.Item
                                                        labelCol={{ flex: 0 }}
                                                        wrapperCol={{ flex: 1 }}
                                                        label="宽"
                                                        name="backgroundSizeWidth"
                                                        colon={false}
                                                    >
                                                        <UnitInput placeholder="width" />
                                                    </Form.Item>
                                                </Col>
                                                <Col span={12} style={{ paddingLeft: 8 }}>
                                                    <Form.Item
                                                        labelCol={{ flex: 0 }}
                                                        wrapperCol={{ flex: 1 }}
                                                        label="高"
                                                        name="backgroundSizeHeight"
                                                        colon={false}
                                                    >
                                                        <UnitInput placeholder="height" />
                                                    </Form.Item>
                                                </Col>
                                            </Row>
                                        );
                                    }}
                                </Form.Item>
                                <Row>
                                    <Col
                                        flex={layout.labelCol.flex}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            paddingRight: 10,
                                        }}
                                    >
                                        定位
                                    </Col>
                                    <Col
                                        flex={1}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Row>
                                            <Col flex={0}>
                                                <QuickPosition type="rect" />
                                            </Col>
                                            <Col
                                                flex={1}
                                                style={{
                                                    paddingLeft: 16,
                                                    paddingTop: 4,
                                                }}
                                            >
                                                <Form.Item
                                                    labelCol={{ flex: 0 }}
                                                    wrapperCol={{ flex: 1 }}
                                                    label="左"
                                                    name="backgroundPositionLeft"
                                                    colon={false}
                                                >
                                                    <UnitInput placeholder="left" style={{ width: 80 }} />
                                                </Form.Item>
                                                <Form.Item
                                                    labelCol={{ flex: 0 }}
                                                    wrapperCol={{ flex: 1 }}
                                                    label="顶"
                                                    name="backgroundPositionTop"
                                                    colon={false}
                                                >
                                                    <UnitInput placeholder="top" style={{ width: 80 }} />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        );
                    }}
                </Form.Item>
            </Form>
        </div>
    );
}
