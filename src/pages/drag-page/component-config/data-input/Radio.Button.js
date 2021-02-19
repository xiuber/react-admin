import {handleAfterRender} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    hooks: {
        afterRender: handleAfterRender,
    },
    fields: [
        {label: '选中', category: '选项', field: 'checked', type: 'boolean'},
        {label: '禁用', category: '选项', field: 'disabled', type: 'boolean'},
    ],
};
