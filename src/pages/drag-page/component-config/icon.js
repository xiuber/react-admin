import React from 'react';
import * as antdIcon from '@ant-design/icons';

const antdIconConfig = {};
Object.keys(antdIcon)
    .filter((key, index) => {
        return /^[A-Z]/.test(key);
    })
    .forEach(key => {
        const Icon = antdIcon[key];
        antdIconConfig[key] = {
            isContainer: false,
            icon: <Icon/>,
            propsToSet: {
                icon: {
                    componentName: key,
                },
            },
        };
    });

export default {
    ...antdIconConfig,
};
