import React from 'react';
import './style.less';

export default function Text(props) {
    const {text, draggable, ...others} = props;
    return (
        <sapn styleName={draggable ? 'draggable' : 'unDraggable'} {...others}>
            {text}
        </sapn>
    );
};

