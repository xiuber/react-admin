import {useEffect, useRef} from 'react';
import {Modal} from 'antd';

export default type => function ModalMethod(props) {
    const {children, ...others} = props;
    const id = children?.props?.config?.id;
    const nodeSelectType = children?.props?.nodeSelectType;
    const iframeDocument = children?.props?.iframeDocument;
    const dragPageAction = children?.props?.dragPageAction;
    const modalRef = useRef(null);

    function handleClick(e) {
        if (nodeSelectType === 'meta' && (e.metaKey || e.ctrlKey)) return;

        modalRef.current = Modal[type]({
            getContainer: () => iframeDocument?.body,
            ...others,
        });

        // 不渲染，标题和内容无法编辑
        setTimeout(() => dragPageAction.render());
    }

    if (modalRef.current) {
        modalRef.current.update({
            ...others,
        });
    }

    useEffect(() => {
        if (id && iframeDocument) {
            const element = iframeDocument.querySelector(`.id_${id}`);
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
