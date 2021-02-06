export default [
    {
        label: '按钮类型', field: 'type', type: 'enum', defaultValue: 'default', version: '',
        options: [
            {value: 'primary', label: '主按钮'},
            {value: 'ghost', label: '幽灵按钮'},
            {value: 'dashed', label: '虚线按钮'},
            {value: 'link', label: '连接按钮'},
            {value: 'text', label: '文本按钮'},
        ],
        desc: '设置按钮类型',
    },
    {label: '图标', field: 'icon', type: 'IconReactNode', version: '', desc: '设置按钮的图标组件'},
    {label: '跳转地址', field: 'href', type: 'string', version: '', desc: '点击跳转的地址，指定此属性 button 的行为和 a 链接一致'},
    {label: '跳转目标', appendField: 'href', field: 'target', type: 'string', version: '', desc: '相当于 a 链接的 target 属性，href 存在时生效'},
    {label: '幽灵按钮', field: 'ghost', type: 'boolean', defaultValue: false, version: '', desc: '幽灵属性，使按钮背景透明'},
    {label: '禁用', field: 'disabled', type: 'boolean', defaultValue: false, version: '', desc: '按钮失效状态'},
    {label: '危险按钮', field: 'danger', type: 'boolean', defaultValue: false, version: '', desc: '设置危险按钮'},
    {label: '撑满父级', field: 'block', type: 'boolean', defaultValue: false, version: '', desc: '将按钮宽度调整为其父宽度的选项'},
    {label: '原生htmlType', field: 'htmlType', type: 'string', defaultValue: 'button', version: '', desc: '设置 button 原生的 type 值，可选值请参考 HTML 标准'},
    {label: '加载中', field: 'loading', type: 'boolean', defaultValue: false, version: '', desc: '设置按钮载入状态'},
    {
        label: '按钮形状', field: 'shape', type: 'enum', version: '',
        options: [
            {value: 'circle', label: '原型'},
            {value: 'round', label: '圆角'},
        ],
        desc: '设置按钮形状',
    },
    {
        label: '按钮大小', field: 'size', type: 'enum', defaultValue: 'middle', version: '',
        options: [
            {value: 'large', label: '大号'},
            {value: 'small', label: '小号'},
        ],
        desc: '设置按钮大小',
    },
    // {label: '按钮事件', field: 'onClick', type: '(event) => void', version: '', desc: '点击按钮时的回调'},
];
