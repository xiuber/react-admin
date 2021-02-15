
import {handleAfterRender} from 'src/pages/drag-page/util'
export default {
    isContainer: true,
    dropInTo: 'Collapse',
    withHolder: true,
    hooks: {
        afterRender: handleAfterRender,
    },
    fields: [],
};
