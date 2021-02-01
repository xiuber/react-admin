import React from 'react';

export default function DragHolder(props) {
    const {style, className, ...others} = props;
    return (
        <div
            className={`${className} DragHolder`}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 1,
                pointerEvents: 'none', // 忽略鼠标事件，拖拽元素不会放入其中，也不会拖动了
                height: 45,
                ...style,
            }}
            {...others}
        >
            请拖入组件
        </div>
    );
};

