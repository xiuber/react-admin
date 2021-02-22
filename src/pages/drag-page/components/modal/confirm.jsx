import React, {useEffect, useRef} from 'react';
import {Modal} from 'antd';

export default function Confirm(props) {
    const {children, ...others} = props;
    const id = children?.props?.config?.id;
    const nodeSelectType = children?.props?.nodeSelectType;
    const iframeDocument = children?.props?.iframeDocument;
    const modalRef = useRef(null);

    function handleClick(e) {
        if (nodeSelectType === 'meta' && (e.metaKey || e.ctrlKey)) return;

        modalRef.current = Modal.confirm({
            getContainer: () => iframeDocument?.body,
            ...others,
        });
    }

    if (modalRef.current) {
        modalRef.current.update({
            ...others,
        });
    }

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
