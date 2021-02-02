document.querySelectorAll('.ant-menu-item-group')
    .forEach(group => {
        const category = group.querySelector('.ant-menu-item-group-title').innerText;
        const children = group.querySelectorAll('.ant-menu-item');
        const components = [];
        children.forEach(item => {
            const componentName = item.querySelector('a>span').innerText;
            const title = item.querySelector('a>span.chinese').innerText;
            const subTitle = `${title} ${componentName}`;
            components.push({
                title,
                subTitle,
                children: [
                    {
                        title,
                        renderPreview: true,
                        config: {
                            __config: {
                                isContainer: false,
                            },
                            componentName,
                        },
                    },
                ],
            });
        });
        let str = JSON.stringify(components, null, 4);

        if (category === '数据录入') {
            let keys = [];
            const loop = nodes => {
                nodes.forEach(node => {
                    Object.entries(node).forEach(([key, value]) => {
                        keys.push(key);
                        if (typeof value === 'object') {
                            if (Array.isArray(value)) {
                                loop(value);
                            } else {
                                loop([value]);
                            }
                        }
                    });
                });
            };
            loop(components);

            keys = Array.from(new Set(keys));

            keys.forEach(key => {
                const re = new RegExp(`"${key}":`, 'g');
                str = str.replace(re, `${key}:`);
            });

            console.log(str);
        }
    });

