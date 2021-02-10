import React from 'react';
import config from 'src/commons/config-hoc';
import {cloneDeep} from 'lodash';

export default config({
    connect: true,
})(function DraggableComponent(props) {
    const {
        data,
        action: {
            dragPage: dragPageAction,
        },
        children,
        style = {},
        onDragStart,
        onDragEnd,
        ...others
    } = props;

    function handleDragStart(e) {
        onDragStart && onDragStart(e);
        e.stopPropagation();

        // 打开组件组
        setTimeout(() => {
            dragPageAction.setActiveSideKey('componentTree');
        });

        // TODO 处理componentId，删除存在的componentId，替换相关联的componentId，比如modal关联的

        const config = cloneDeep(data.config);
        config.__config.__fromStore = true;

        e.dataTransfer.setData('componentConfig', JSON.stringify(config));
        dragPageAction.setDraggingNode(config);
    }

    function handleDragEnd(e) {
        // 从新打开组件库
        dragPageAction.setActiveSideKey('componentStore');
        dragPageAction.setDraggingNode(null);
        onDragEnd && onDragEnd(e);
    }

    const draggable = !!data;

    if (!draggable) return children;

    return (
        <div
            {...others}
            style={{cursor: 'move', ...style}}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            {children}
        </div>
    );
});

