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

export default {
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
        return (
            <InputNumber allowClear placeholder={field} {...props}/>
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
        console.log(props);
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
