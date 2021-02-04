import React from 'react';
import './style.less';

function Text(props) {
    const { text, isDraggable, ...others } = props;
    return (
        <sapn styleName={isDraggable ? 'draggable' : 'unDraggable'} {...others}>
            {text}
        </sapn>
    );
}

Text.defaultProps = {
    isDraggable: false,
};
export default Text;

