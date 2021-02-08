import React from 'react';

export default function ModalFooter(props) {
    const {
        className,
        children,
        ...others
    } = props;

    return (
        <div
            className={`ant-modal-footer ${className}`}
            {...others}
        >
            {children}
        </div>
    );
};

