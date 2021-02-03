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

const typeOptions = [
    {value: 'color', label: '填充颜色', icon: <PicCenterOutlined/>},
    {value: 'image', label: '背景图', icon: <PicCenterOutlined/>},
];

export default function Background(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {

        onChange(allValues);
        console.log('allValues', JSON.stringify(allValues, null, 4));
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
                    label="背景类型"
                    name="__type"
                    initialValue="color"
                    colon={false}
                >
                    <RadioGroup options={typeOptions}/>
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const __type = getFieldValue('__type');
                        if (__type === 'color') {
                            return (
                                <div style={{paddingLeft: 58}}>
                                    <Form.Item
                                        name="backgroundColor"
                                        noStyle
                                        colon={false}
                                    >
                                        <Input
                                            allowClear
                                            placeholder='background-color'
                                        />
                                    </Form.Item>
                                </div>
                            );
                        }
                    }}
                </Form.Item>
            </Form>
        </div>
    );
}
