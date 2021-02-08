import React from 'react';
import PropTypes from 'prop-types';
import {action} from 'src/models';

import './style.less';

const DraggableNode = props => {
    const {dragPage: dragPageAction} = action;
    const {
        dataTransfer: {key, value},
        draggingNode,
        children,
        ...others
    } = props;

    return (
        <div
            draggable
            onDragStart={e => {
                e.stopPropagation();
                e.dataTransfer.setData(key, value);

                console.log(dragPageAction);
                dragPageAction.setDraggingNode(draggingNode);
            }}
            {...others}
        >
            {children}
        </div>
    );
};

DraggableNode.propTypes = {
    dataTransfer: PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired,
    }).isRequired,
    draggingNode: PropTypes.object,
};

export default DraggableNode;
