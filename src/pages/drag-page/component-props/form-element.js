import React from 'react';

import {
    Input,
    Select,
    Switch,
    InputNumber,
    Button,
    Tooltip,
} from 'antd';
import RadioGroup from 'src/pages/drag-page/component-style/radio-group';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import ColorInput from 'src/pages/drag-page/component-style/color-input';
import OptionsEditor from 'src/pages/drag-page/component-props/options-editor';
import FooterSwitch from './FooterSwitch';
import OffsetInput from 'src/pages/drag-page/component-props/offset-input';
import Placement from 'src/pages/drag-page/component-props/placement';
import ReactNode from 'src/pages/drag-page/component-props/ReactNode';
import MultipleElement from 'src/pages/drag-page/component-props/multiple-element';
import ObjectElement from 'src/pages/drag-page/component-props/object-element';
import ArrayElement from 'src/pages/drag-page/component-props/array-element';

function getPlaceholder(option, props) {
    const {field, placeholder} = option;
    if (placeholder) return placeholder;
    if (Array.isArray(field)) return field.join('.');

    return field;
}

const elementMap = {
    ReactNode: (option) => props => {
        const {node} = option;

        return <ReactNode {...props} node={node}/>;
    },
    placement: (option) => props => {
        return (
            <Placement
                allowClear
                {...props}
            />
        );
    },
    offset: (option) => props => {
        return (
            <OffsetInput
                allowClear
                {...props}
            />
        );
    },
    color: (option) => props => {
        return (
            <ColorInput
                allowClear
                placeholder={getPlaceholder(option, props)}
                {...props}
            />
        );
    },
    FooterSwitch: (option) => props => {
        return (
            <FooterSwitch {...props}/>
        );
    },
    options: (option) => props => {
        const {withLabel} = option;
        return (
            <OptionsEditor withLabel={withLabel} {...props}/>
        );
    },
    unit: (option) => props => {
        return (
            <UnitInput
                allowClear
                placeholder={getPlaceholder(option, props)}
                {...props}
            />
        );
    },
    boolean: () => props => {
        const {value} = props;
        return (
            <Switch checked={value} {...props}/>
        );
    },
    string: option => props => {
        return (
            <Input allowClear placeholder={getPlaceholder(option, props)} {...props}/>
        );
    },
    number: option => props => {
        const {style} = props;
        return (
            <InputNumber
                allowClear
                placeholder={getPlaceholder(option, props)}
                style={{width: '100%', ...style}}
                {...props}
            />
        );
    },
    select: option => props => {
        const {options: _options} = option;
        return (
            <Select
                allowClear
                placeholder={getPlaceholder(option, props)}
                options={_options}
                {...props}
            />
        );
    },
    'radio-group': option => props => {
        const {options: _options} = option;
        return (
            <RadioGroup
                allowClear
                options={_options}
                placement="top"
                {...props}
            />
        );
    },
    button: option => props => {
        const {label, field} = option;
        const {value, onChange} = props;
        return (
            <Tooltip
                placement="top"
                mouseLeaveDelay={0}
                title={`${label} ${field}`}
            >
                <Button
                    type={value ? 'primary' : 'default'}
                    onClick={() => onChange && onChange(!value)}
                    {...props}
                >
                    {label}
                </Button>
            </Tooltip>
        );
    },
    IconReactNode: option => props => {
        // TODO
        return <span style={{color: 'red'}}>TODO 请选择图标</span>;
    },
};

export default elementMap;


export function getElement(option) {
    const {type} = option;

    if (Array.isArray(type)) {
        return (props) => <MultipleElement fieldOption={option} {...props}/>;
    }

    if ((typeof type === 'object' && type.value === 'object') || type === 'object') {
        const {fields} = type;
        return (props) => <ObjectElement fields={fields} {...props}/>;
    }

    if (typeof type === 'object' && type.value === 'array') {

        return (props) => <ArrayElement length={type.length} type={type.type} {...props}/>;
    }

    const elementFunction = elementMap[type];

    if (elementFunction) {
        return elementFunction({...option});
    }

    return (props) => <span style={{color: 'red'}}>TODO {type} 对应的表单元素不存在</span>;
}
