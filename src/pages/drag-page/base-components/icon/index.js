import * as antdIcon from '@ant-design/icons';

export default [
    {
        title: 'antd官方',
        subTitle: 'antd官方图标 Icon',
        children: [
            ...(Object.keys(antdIcon)
                .filter((key, index) => {
                    // TODO 测试
                    return index < 10;
                    // // 首字母大写
                    // return /^[A-Z]/.test(key);
                })
                .map(componentName => {
                    return {
                        title: componentName,
                        renderPreview: true,
                        previewStyle: {fontSize: 20},
                        icon: false,
                        config: {
                            componentName: componentName,
                        },
                    };
                })),
        ],
    },
];
