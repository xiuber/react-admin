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

function getPlaceholder(options, props) {
    const {field, placeholder} = options;
    if (placeholder) return placeholder;
    if (Array.isArray(field)) return field.join('.');

    return field;
}

export default {
    placement: (options) => props => {
        return (
            <Placement
                allowClear
                {...props}
            />
        );
    },
    offset: (options) => props => {
        return (
            <OffsetInput
                allowClear
                {...props}
            />
        );
    },
    color: (options) => props => {
        return (
            <ColorInput
                allowClear
                placeholder={getPlaceholder(options, props)}
                {...props}
            />
        );
    },
    FooterSwitch: (options) => props => {
        return (
            <FooterSwitch {...props}/>
        );
    },
    options: (options) => props => {
        const {withLabel} = options;
        return (
            <OptionsEditor withLabel={withLabel} {...props}/>
        );
    },
    unit: (options) => props => {
        return (
            <UnitInput
                allowClear
                placeholder={getPlaceholder(options, props)}
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
    string: options => props => {
        return (
            <Input allowClear placeholder={getPlaceholder(options, props)} {...props}/>
        );
    },
    number: options => props => {
        const {style} = props;
        return (
            <InputNumber
                allowClear
                placeholder={getPlaceholder(options, props)}
                style={{width: '100%', ...style}}
                {...props}
            />
        );
    },
    select: options => props => {
        const {options: _options} = options;
        return (
            <Select
                allowClear
                placeholder={getPlaceholder(options, props)}
                options={_options}
                {...props}
            />
        );
    },
    'radio-group': options => props => {
        const {options: _options} = options;
        return (
            <RadioGroup
                allowClear
                options={_options}
                placement="top"
                {...props}
            />
        );
    },
    button: options => props => {
        const {label, field} = options;
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
    IconReactNode: options => props => {
        // TODO
        return <span style={{color: 'red'}}>TODO 请选择图标</span>;
    },
};
