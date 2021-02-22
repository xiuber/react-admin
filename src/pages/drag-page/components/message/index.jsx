import {useEffect} from 'react';
import {message} from 'antd';

export default function Message(props) {
    let {children, type, ...others} = props;
    if (!type) type = 'success';

    const id = children?.props?.config?.id;
    const nodeSelectType = children?.props?.nodeSelectType;
    const iframeDocument = children?.props?.iframeDocument;
    const dragPageAction = children?.props?.dragPageAction;

    function handleClick(e) {
        if (nodeSelectType === 'meta' && (e.metaKey || e.ctrlKey)) return;

        message[type]({
            getContainer: () => iframeDocument?.body,
            ...others,
        });

        // 不渲染，标题和内容无法编辑
        setTimeout(() => dragPageAction.render());
    }

    useEffect(() => {
        if (!iframeDocument) return;

        message.config({
            getContainer: () => iframeDocument?.body || document.body,
        });

    }, [iframeDocument]);

    useEffect(() => {
        if (id && iframeDocument) {
            const element = iframeDocument.querySelector(`[data-component-id="${id}"]`);
            if (element) {

                element.addEventListener('click', handleClick);

                return () => {
                    element.removeEventListener('click', handleClick);
                };
            }
        }
    });

    return children;
}
