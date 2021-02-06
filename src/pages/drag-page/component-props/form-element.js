import React from 'react';

import {Input, Select, Switch, InputNumber} from 'antd';

export default {
    boolean: () => props => {
        return (
            <Switch {...props}/>
        );
    },
    string: options => props => {
        const {field} = options;
        return (
            <Input placeholder={field} {...props}/>
        );
    },
    number: options => props => {
        const {field} = options;
        return (
            <InputNumber placeholder={field} {...props}/>
        );
    },
    enum: options => props => {
        const {field, options: _options} = options;
        return (
            <Select
                placeholder={field}
                options={_options}
                {...props}
            />
        );
    },
    IconReactNode: options => props => {
        // TODO
        return '请选择图标';
    },
};
