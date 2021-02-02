配置说明

```js
export default {
    title: '选择器',
    subTitle: '选择器 Select',
    children: [
        {
            title: '选择器',
            // renderPreview: true,
            renderPreview: <div>直接jsx</div>,
            previewZoom: .5, // 预览缩放
            // previewStyle: {width: '100%'},
            config: {
                componentName: 'Select',
                props: {
                    style: {width: '100%'},
                },
            },
        },
    ],
}
,
```
