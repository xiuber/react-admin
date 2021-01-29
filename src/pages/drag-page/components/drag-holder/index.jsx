import React from 'react';

export default function DragHolder(props) {
    const {style, ...others} = props;
    return (
        <div
            style={{
                height: 'calc(100vh - 2px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 1,
            }}
            {...others}
        >
            <h1>请拖入组件</h1>
        </div>
    );
};

