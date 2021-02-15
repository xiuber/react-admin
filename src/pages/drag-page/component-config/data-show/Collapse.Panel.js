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

            const props = {
                ...dragProps,
            };

            Object.entries(props)
                .forEach(([key, value]) => {
                    if (key === 'onClick') return;

                    ele.setAttribute(key, value);
                });

            ele.onclick = dragProps.onClick;
        },
    },
    fields: [],
};
