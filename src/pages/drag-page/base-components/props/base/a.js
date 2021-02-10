import {targetOptions} from '../options';

export default {
    labelWidth: '80px',
    fields: [
        {label: '跳转地址', field: 'href', type: 'string'},
        {
            label: '目标', field: 'target', type: 'radio-group',
            options: targetOptions,
        },
    ],
};
