export default {
    isContainer: true,
    dropInTo: 'Collapse',
    withHolder: true,
    hooks: {
        afterRender: options => {
            const {node, dragProps, iframeDocument} = options;
            if (!iframeDocument) return;
            const {id} = node;

            const ele = iframeDocument.querySelector(`.id_${id}`);

            Object.entries(dragProps)
                .forEach(([key, value]) => {
                    ele.setAttribute(key, value);
                });
        },
    },
    fields: [],
};
