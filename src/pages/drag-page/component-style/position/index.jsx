import React, {useEffect} from 'react';
import {
    Form,
    Input,
    InputNumber,
    Select,
    Row,
    Col,
    Tooltip,
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
        const {translateY, translateX} = allValues;
        let {transform} = value;

        if (!transform) transform = '';

        const setTransform = (key, value) => {
            const re = new RegExp(`${key}\\([^\\)]+\\)`);

            if (value) {
                if (transform.includes(key)) {
                    transform = transform.replace(re, `${key}(${value})`);
                } else {
                    transform = `${transform} ${key}(${value})`;
                }
            } else {
                transform = transform.replace(re, '');
            }
            // 去前后空格
            transform = transform.trim();
            // 多个空格转为单个空格
            transform = transform.replace(/\s{2,}/g, ' ');
            Reflect.deleteProperty(allValues, key);
        };

        setTransform('translateY', translateY);
        setTransform('translateX', translateX);

        allValues.transform = transform;

        console.log('allValues', JSON.stringify(allValues, null, 4));
        onChange(allValues);
    }

    useEffect(() => {
        // 先重置，否则会有字段不清空情况
        form.resetFields();
        form.setFieldsValue(value);
        const {transform} = value;
        if (!transform) return;

        console.log(transform);

        const [, translateY] = (/translateY\(([^\)]+)\)/.exec(transform) || []);
        const [, translateX] = (/translateX\(([^\)]+)\)/.exec(transform) || []);

        form.setFieldsValue({translateY, translateX});
    }, [value]);

    const quickPositionOptions = [
        {value: 'topLeft', icon: <PicCenterOutlined/>, label: '左上角', fieldsValue: {top: 0, left: 0}},
        {value: 'topRight', icon: <PicCenterOutlined/>, label: '右上角', fieldsValue: {top: 0, right: 0}},
        {value: 'bottomLeft', icon: <PicCenterOutlined/>, label: '左上角', fieldsValue: {bottom: 0, left: 0}},
        {value: 'bottomRight', icon: <PicCenterOutlined/>, label: '右下角', fieldsValue: {right: 0, bottom: 0}},
        {value: 'leftCenter', icon: <PicCenterOutlined/>, label: '左居中', fieldsValue: {top: '50%', left: 0, translateY: '-50%'}},
        {value: 'rightCenter', icon: <PicCenterOutlined/>, label: '右居中', fieldsValue: {top: '50%', right: 0, translateY: '-50%'}},
        {value: 'topCenter', icon: <PicCenterOutlined/>, label: '上居中', fieldsValue: {top: 0, left: '50%', translateX: '-50%'}},
        {value: 'bottomCenter', icon: <PicCenterOutlined/>, label: '下居中', fieldsValue: {bottom: 0, left: '50%', translateX: '-50%'}},
        {value: 'center', icon: <PicCenterOutlined/>, label: '居中', fieldsValue: {top: '50%', left: '50%', translateY: '-50%', translateX: '-50%'}},
    ];

    return (
        <div styleName="root">
            <Form
                form={form}
                onValuesChange={handleChange}
                name="position"
            >
                <Form.Item
                    label="定位类型"
                    name="position"
                    colon={false}
                >
                    <Select
                        placeholder="position"
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
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const position = getFieldValue('position');
                        if (position === 'absolute' || position === 'fixed') {

                            return (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    marginLeft: 60,
                                    marginBottom: 5,
                                }}>
                                    {quickPositionOptions.map(item => {
                                        const {value, label, icon, fieldsValue} = item;
                                        const {
                                            top = 'auto',
                                            right = 'auto',
                                            left = 'auto',
                                            bottom = 'auto',
                                            translateY,
                                            translateX,
                                        } = fieldsValue;

                                        return (
                                            <Tooltip key={value} placement="top" title={label}>
                                                <div
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => {

                                                        const fields = {
                                                            top,
                                                            right,
                                                            left,
                                                            bottom,
                                                            translateY,
                                                            translateX,
                                                        };

                                                        form.setFieldsValue(fields);

                                                        handleChange(fields, form.getFieldsValue());
                                                    }}
                                                >
                                                    {icon}
                                                </div>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            );
                        }
                    }}
                </Form.Item>
                <Form.Item shouldUpdate noStyle>
                    {({getFieldValue}) => {
                        const position = getFieldValue('position');

                        if (!position || position === 'static') return null;

                        return (
                            <RectInputsWrapper large style={{height: 110, marginLeft: 60, marginBottom: 8}}>
                                {directionOptions.map(item => {
                                    return (
                                        <Form.Item
                                            name={item}
                                            noStyle
                                            colon={false}
                                        >
                                            <UnitInput
                                                allowClear={false}
                                                placeholder='auto'
                                                onClick={event => handleSyncFields({event, form, fields: directionOptions, field: item})}
                                                onKeyDown={event => handleSyncFields({enter: true, event, form, fields: directionOptions, field: item})}
                                            />
                                        </Form.Item>
                                    );
                                })}
                            </RectInputsWrapper>
                        );
                    }}
                </Form.Item>
                <Form.Item
                    label="层叠顺序"
                    name="zIndex"
                    colon={false}
                >
                    <InputNumber
                        style={{width: '100%'}}
                        step={1}
                        placeholder="z-index"
                    />
                </Form.Item>
                <Form.Item
                    label="水平移动"
                    name="translateX"
                    colon={false}
                >
                    <UnitInput placeholder="translateX"/>
                </Form.Item>
                <Form.Item
                    label="垂直移动"
                    name="translateY"
                    colon={false}
                >
                    <UnitInput placeholder="translateY"/>
                </Form.Item>
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
