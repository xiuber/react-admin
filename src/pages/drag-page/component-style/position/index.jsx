import React, {useEffect} from 'react';
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
import RectInputsWrapper from '../rect-inputs-wrapper';
import './style.less';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import {handleSyncFields} from 'src/pages/drag-page/component-style/util';

const positionOptions = [
    {value: 'static', label: '无定位', icon: <PicCenterOutlined/>},
    {value: 'relative', label: '相对定位', icon: <PicCenterOutlined/>},
    {value: 'absolute', label: '绝对定位', icon: <PicCenterOutlined/>},
    {value: 'fixed', label: '固定定位', icon: <PicCenterOutlined/>},
    {value: 'sticky', label: '粘性定位', icon: <PicCenterOutlined/>},
];

const floatOptions = [
    {value: 'none', label: '不浮动', icon: <PicCenterOutlined/>},
    {value: 'left', label: '左浮动', icon: <PicCenterOutlined/>},
    {value: 'right', label: '右浮动', icon: <PicCenterOutlined/>},
];
const clearOptions = [
    {value: 'none', label: '不清除', icon: <PicCenterOutlined/>},
    {value: 'left', label: '左清除', icon: <PicCenterOutlined/>},
    {value: 'right', label: '右清除', icon: <PicCenterOutlined/>},
    {value: 'both', label: '左右清除', icon: <PicCenterOutlined/>},
];
const directionOptions = ['top', 'right', 'bottom', 'left'];

export default function Position(props) {
    const {value, onChange = () => undefined} = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        onChange(allValues);
        console.log('allValues', allValues);
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
                <Form.Item
                    label="定位类型"
                    name="position"
                    colon={false}
                >
                    <Select
                        placeholder="请选择定位类型"
                        options={positionOptions.map(item => {
                            const {value, label, icon} = item;

                            let lab = `${label} ${value}`;

                            if (icon) lab = <span>{icon} {lab}</span>;

                            return {
                                value,
                                label: lab,
                            };
                        })}
                    />
                </Form.Item>
                <RectInputsWrapper large style={{height: 140, marginLeft: 60, marginBottom: 8}}>
                    {directionOptions.map(item => {
                        return (
                            <Form.Item
                                name={item}
                                noStyle
                                colon={false}
                            >
                                <UnitInput
                                    allowClear={false}
                                    placeholder={''}
                                    onClick={event => handleSyncFields({event, form, fields: directionOptions, field: item})}
                                    onKeyDown={event => handleSyncFields({enter: true, event, form, fields: directionOptions, field: item})}
                                />
                            </Form.Item>
                        );
                    })}
                    <div styleName="innerInput">
                        <Form.Item
                            label="左移"
                            name="translateX"
                            colon={false}
                        >
                            <UnitInput allowClear={false} style={{width: 60, marginRight: 8}}/>
                        </Form.Item>
                        <Form.Item
                            label="右移"
                            name="translateY"
                            colon={false}
                        >
                            <UnitInput allowClear={false} style={{width: 60}}/>
                        </Form.Item>
                    </div>
                </RectInputsWrapper>
                <div style={{paddingLeft: 60}}>
                    <Form.Item
                        label="层叠顺序"
                        name="zIndex"
                        colon={false}
                    >
                        <InputNumber
                            style={{width: '100%'}}
                            step={1}
                            placeholder="请输入"
                        />
                    </Form.Item>
                </div>
                <Form.Item
                    label="浮动方向"
                    name="float"
                    colon={false}
                >
                    <RadioGroup options={floatOptions}/>
                </Form.Item>

                <Form.Item
                    label="清除浮动"
                    name="clear"
                    colon={false}
                >
                    <RadioGroup options={clearOptions}/>
                </Form.Item>
            </Form>
        </div>
    );
}
