import React from 'react';

import {Input, Select, Switch, InputNumber} from 'antd';

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
    enum: options => props => {
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
    IconReactNode: options => props => {
        // TODO
        return <span style={{color: 'red'}}>TODO 请选择图标</span>;
    },
};
