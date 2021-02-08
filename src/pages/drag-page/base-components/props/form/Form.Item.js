import {isMac} from 'src/pages/drag-page/util';

export default {
    fields: [
        {label: '必填', category: '选项', field: 'required', type: 'boolean', defaultValue: false, version: '', desc: '必填样式设置。如不设置，则会根据校验规则自动生成'},
        {label: '校验图标', category: '选项', field: 'hasFeedback', type: 'boolean', defaultValue: false, version: '', desc: '配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用'},
        {label: '冒号', category: '选项', field: 'colon', type: 'boolean', defaultValue: true, version: '', desc: '配合 label 属性使用，表示是否显示 label 后面的冒号'},
        {label: '无样式', category: '选项', field: 'noStyle', type: 'boolean', defaultValue: false, version: '', desc: '为 true 时不带样式，作为纯字段控件使用'},

        {label: '标签文本', field: 'label', type: 'string', version: '', desc: 'label 标签的文本'},
        {label: '提示信息', field: 'tooltip', type: 'string', version: '4.7.0', desc: '配置提示信息'},
        {
            label: '标签对齐', field: 'labelAlign', type: 'radio-group', defaultValue: 'right', version: '',
            options: [
                {value: 'left', label: '左对齐'},
                {value: 'right', label: '右对齐'},
            ],
            desc: '标签文本对齐方式',
        },
        // TODO  怎么支持更多情况
        {
            label: '标签宽度', field: ['labelCol', 'flex'], type: 'unit', version: '',
            placeholder: `labelCol.flex    ${isMac ? '⌘' : 'ctrl'}+Enter 同步所有标签`,
            onKeyDown: (e, options) => {
                const {metaKey, ctrlKey, key, target: {value}} = e;
                const isEnter = key === 'Enter';
                const {node, dragPageAction} = options;

                if ((metaKey || ctrlKey) && isEnter) {
                    dragPageAction.syncFormItemLabelColFlex({node, flex: value});
                }
            },
            title: `标签宽度，${isMac ? '⌘' : 'ctrl'}+Enter 同步同表单下所有标签`
        },
        {label: '字段名', field: 'name', type: 'string', version: '', desc: '字段名，支持数组'},
        {label: '默认值', field: 'initialValue', type: 'string', version: '4.2.0', desc: '设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准'},

        {label: '校验规则', field: 'rules', type: 'Rule[]', version: '', desc: '校验规则，设置字段的校验逻辑。点击此处查看示例'},
        //
        // {
        //     label: '元素布局',
        //     field: 'wrapperCol',
        //     type: 'object',
        //     version: '',
        //     desc: '需要为输入控件设置布局样式时，使用该属性，用法同 labelCol。你可以通过 Form 的 wrapperCol 进行统一设置，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准',
        // },

        /*
        {label: '提示信息', field: 'extra', type: 'string', version: '', desc: '额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。'},
        {label: '提示信息2', field: 'help', type: 'string', version: '', desc: '提示信息，如不设置，则会根据校验规则自动生成'},
        {label: '是否隐藏字段', field: 'hidden', type: 'boolean', defaultValue: false, version: '', desc: '是否隐藏字段（依然会收集和校验字段）'},

        {label: '设置依赖字段，说明见下', field: 'dependencies', type: 'NamePath[]', version: '', desc: '设置依赖字段，说明见下'},
        {label: '设置如何将 event 的值转换成字段值', field: 'getValueFromEvent', type: '(..args: any[]) => any', version: '', desc: '设置如何将 event 的值转换成字段值'},
        {label: '为子元素添加额外的属性', field: 'getValueProps', type: '(value: any) => any', version: '4.2.0', desc: '为子元素添加额外的属性'},
        {label: 'htmlFor', field: 'htmlFor', type: 'string', version: '', desc: '设置子元素 label htmlFor 属性'},

        {
            label: 'label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}。你可以通过 Form 的 labelCol 进行统一设置，，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准',
            field: 'labelCol',
            type: 'object',
            version: '',
            desc: 'label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}。你可以通过 Form 的 labelCol 进行统一设置，，不会作用于嵌套 Item。当和 Form 同时设置时，以 Item 为准',
        },
        {label: '默认验证字段的信息', field: 'messageVariables', type: 'Record<string, string>', version: '4.7.0', desc: '默认验证字段的信息'},
        {label: '组件获取值后进行转换，再放入 Form 中。不支持异步', field: 'normalize', type: '(value, prevValue, prevValues) => any', version: '', desc: '组件获取值后进行转换，再放入 Form 中。不支持异步'},

        {label: '当字段被删除时保留字段值', field: 'preserve', type: 'boolean', defaultValue: true, version: '4.4.0', desc: '当字段被删除时保留字段值'},
        {
            label: '自定义字段更新逻辑，说明见下',
            field: 'shouldUpdate',
            type: 'enum',
            defaultValue: 'false',
            version: '',
            options: [{value: 'boolean', label: 'boolean'}, {value: '(prevValue, curValue) => boolean', label: '(prevValue, curValue) => boolean'}],
            desc: '自定义字段更新逻辑，说明见下',
        },
        {label: '设置收集字段值变更的时机。点击此处查看示例', field: 'trigger', type: 'string', defaultValue: 'onChange', version: '', desc: '设置收集字段值变更的时机。点击此处查看示例'},
        {
            label: '当某一规则校验不通过时，是否停止剩下的规则的校验。设置 parallel 时会并行校验',
            field: 'validateFirst',
            type: 'enum',
            defaultValue: 'false',
            version: 'parallel: 4.5.0',
            options: [{value: 'boolean', label: 'boolean'}, {value: 'parallel', label: 'parallel'}],
            desc: '当某一规则校验不通过时，是否停止剩下的规则的校验。设置 parallel 时会并行校验',
        },
        {label: '校验状态，如不设置，则会根据校验规则自动生成，可选：\'success\' \'warning\' \'error\' \'validating\'', field: 'validateStatus', type: 'string', version: '', desc: '校验状态，如不设置，则会根据校验规则自动生成，可选：\'success\' \'warning\' \'error\' \'validating\''},
        {label: '设置字段校验的时机', field: 'validateTrigger', type: 'enum', defaultValue: 'onChange', version: '', options: [{value: 'string', label: 'string'}, {value: 'string[]', label: 'string[]'}], desc: '设置字段校验的时机'},
        {
            label: '子节点的值的属性，如 Switch 的是 \'checked\'。该属性为 getValueProps 的封装，自定义 getValueProps 后会失效',
            field: 'valuePropName',
            type: 'string',
            defaultValue: 'value',
            version: '',
            desc: '子节点的值的属性，如 Switch 的是 \'checked\'。该属性为 getValueProps 的封装，自定义 getValueProps 后会失效',
        },

        */
    ],
};