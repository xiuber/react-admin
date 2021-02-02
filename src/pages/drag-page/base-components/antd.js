
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
                        config: {
                            componentName,
                        },
                    },
                ],
            });
        });
        console.log(category);
        if(category === '数据录入') console.log(JSON.stringify(components, null, 4));

    });

