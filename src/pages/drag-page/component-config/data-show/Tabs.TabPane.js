export default {
    draggable: false,
    isContainer: false,
    dropInTo: ['Tabs'],
    fields: [
        {label: '隐藏渲染', field: 'forceRender', type: 'boolean', defaultValue: false, desc: '被隐藏时是否渲染 DOM 结构'},
        {label: 'key', field: 'key', type: 'string', desc: '对应 activeKey'},
        {label: '标签名', field: 'tab', type: 'string', desc: '选项卡头显示文字'},
    ],
};
