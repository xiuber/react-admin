import {handleAfterRender} from 'src/pages/drag-page/util';

export default {
    isContainer: true,
    withDragProps: false,
    hooks: {
        afterRender: handleAfterRender,
    },
    dropAccept: ['Collapse.Panel'],
    fields: [],
};
