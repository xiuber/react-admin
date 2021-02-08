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
import OptionsEditor from 'src/pages/drag-page/component-props/options-editor';

export default {
    options: (options) => props => {
        const {withLabel} = options;
        return (
            <OptionsEditor withLabel={withLabel} {...props}/>
        );
    },
    unit: (options) => props => {
        const {field} = options;
        return (
            <UnitInput
                allowClear
                placeholder={field}
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
        const {field} = options;
        return (
            <Input allowClear placeholder={field} {...props}/>
        );
    },
    number: options => props => {
        const {field} = options;
        const {style} = props;
        return (
            <InputNumber
                allowClear
                placeholder={field}
                style={{width: '100%', ...style}}
                {...props}
            />
        );
    },
    select: options => props => {
        const {field, options: _options} = options;
        return (
            <Select
                allowClear
                placeholder={field}
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