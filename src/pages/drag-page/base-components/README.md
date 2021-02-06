# 配置说明

注：__config 配置说明 在 base-components/index.js 文件中


```js
export default {
    hiddenInStore: true, // 在组件库中不显示，各级都支持此属性
    title: '选择器',
    subTitle: '选择器 Select',
    children: [
        {
            title: '选择器',
            // renderPreview: true, // 直接渲染 config配置
            renderPreview: <div>直接jsx</div>,
            // renderPreview: config => <div>函数返回jsx</div>,
            previewZoom: .5, // 预览缩放
            previewStyle: {width: '100%'}, // 预览组件样式
            previewWrapperStyle: {}, // 预览容器样式
            config: {
                // 基础组件唯一稳定id， 默认componentName
                // 有些特殊情况，两个基础组件 componentName 会相同
                // 比如 PageContent 和 div componentName 都为div
                // 在获取 getComponentConfig 时，仅通过 componentName 无法区分
                // PageContent 需要设置一个id
                id: 'Select', 
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
