import React from 'react';
import * as antdIcon from '@ant-design/icons';

console.log(Object.keys(antdIcon));

export default [
    {
        title: 'antd官方',
        subTitle: 'antd官方图标 Icon',
        children: [
            ...(Object.keys(antdIcon)
                .filter(key => {
                    // 首字母大写
                    return /^[A-Z]/.test(key);
                })
                .map(componentName => {
                    return {
                        title: componentName,
                        renderPreview: true,
                        config: {
                            componentName: componentName,
                        },
                    };
                })),
        ],
    },
];
