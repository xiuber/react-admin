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
                pointerEvents: 'none', // 忽略鼠标事件，拖拽元素不会放入其中，也不会拖动了
                ...style,
            }}
            {...others}
        >
            <h1>请拖入组件</h1>
        </div>
    );
};

