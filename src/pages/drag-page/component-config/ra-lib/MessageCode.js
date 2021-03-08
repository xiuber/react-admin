import {buttonTypeOptions} from '../options';

export default {
    componentType: 'ra-lib',
    fields: [
        {label: '倒计时', field: 'time', type: 'number', defaultValue: 60},
        {
            label: '按钮类型', field: 'buttonType', type: 'radio-group', options: buttonTypeOptions, defaultValue: 'default',
        },
        {label: '输入框提示', field: 'placeholder', type: 'string', defaultValue: '请输入短信验证码'},
    ],
};
