import {handleAfterRender} from 'src/pages/drag-page/util';

export default {
    isFormElement: true,
    isContainer: false,
    widthDragProps: false,
    hooks: {
        afterRender: handleAfterRender,
    },
};
