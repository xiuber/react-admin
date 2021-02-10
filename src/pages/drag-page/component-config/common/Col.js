import {isMac} from 'src/pages/drag-page/util';

export default {
    labelWidth: '100px',
    fields: [
        {
            label: '占位格数',
            field: 'span',
            type: 'number',
            version: '',
            desc: '栅格占位格数，为 0 时相当于 display: none',
            placeholder: `span    ${isMac ? '⌘' : 'ctrl'}+Enter 同步所有列`,
            onKeyDown: (e, options) => {
                const {metaKey, ctrlKey, key, target: {value}} = e;
                const isEnter = key === 'Enter';
                const {node, dragPageAction} = options;

                if ((metaKey || ctrlKey) && isEnter) {
                    dragPageAction.syncOffspringProps({
                        node,
                        ancestorComponentName: 'Row',
                        props: {span: value}
                    });
                }
            },
        },
        {label: '弹性布局属性', field: 'flex', type: 'unit', version: '', desc: 'flex 布局属性'},
        {label: '左间隔格数', span: 12, field: 'offset', type: 'number', defaultValue: '0', version: '', desc: '栅格左侧的间隔格数，间隔内不可以有栅格'},
        {label: '栅格顺序', span: 12, labelWidth: '80px', field: 'order', type: 'number', defaultValue: '0', version: '', desc: '栅格顺序'},
        {label: '左移格数', span: 12, field: 'pull', type: 'number', defaultValue: '0', version: '', desc: '栅格向左移动格数'},
        {label: '右移格数', span: 12, labelWidth: '80px', field: 'push', type: 'number', defaultValue: '0', version: '', desc: '栅格向右移动格数'},

        // TODO number 或 object {flex, offset, order, pull, push, span}
        {label: '屏幕 < 576px', field: 'xs', type: 'number', version: '', desc: '屏幕 < 576px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 576px', field: 'sm', type: 'number', version: '', desc: '屏幕 ≥ 576px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 768px', field: 'md', type: 'number', version: '', desc: '屏幕 ≥ 768px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 992px', field: 'lg', type: 'number', version: '', desc: '屏幕 ≥ 992px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 1200px', field: 'xl', type: 'number', version: '', desc: '屏幕 ≥ 1200px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
        {label: '屏幕 ≥ 1600px', field: 'xxl', type: 'number', version: '', desc: '屏幕 ≥ 1600px 响应式栅格，可为栅格数或一个包含其他属性的对象'},
    ],
};
