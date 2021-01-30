import React from 'react';
import {Table} from 'ra-lib';

export default function DragTable(props) {
    const {
        draggable,
        onDragStart,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        'data-componentDesc': componentDesc,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick,
        ...others
    } = props;

    const wrapProps = {
        draggable,
        onDragStart,
        onDragEnter,
        onDragOver,
        onDragLeave,
        onDrop,
        onDragEnd,
        'data-componentDesc': componentDesc,
        'data-componentId': componentId,
        'data-isContainer': isContainer,
        onClick,
    };
    return (
        <div {...wrapProps}>
            <Table {...others}/>
        </div>
    );
};

