import React, {useRef} from 'react';
import {throttle} from 'lodash';
import {
    findNodeById,
    getDropPosition,
    isDropAccept,
    getNodeEle,
    getDroppableEle,
} from 'src/pages/drag-page/util';

/**
 * 事件委托，统一添加事件，不给每个元素添加事件，提高性能
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */

export default function DragAction(props) {
    const {
        activeSideKey, // 左侧激活面板
        pageConfig,
        iframeDocument,
        draggingNode,
        dragPageAction,
        children,
    } = props;

    // 左侧key
    const prevSideKeyRef = useRef(null);

    function handleDragStart(e) {
        e.stopPropagation();
        const dragEle = e.target;

        const componentId = dragEle.getAttribute('data-componentId');
        const node = findNodeById(pageConfig, componentId);

        dragPageAction.setDraggingNode(node);
        prevSideKeyRef.current = activeSideKey;
        dragPageAction.setActiveSideKey('componentTree');

        // 拖拽携带的数据
        e.dataTransfer.setData('sourceComponentId', componentId);
    }

    function handleDragLeave() {
        dragPageAction.setDragOverInfo(null);
    }

    function handleDragEnd(e) {
        e && e.stopPropagation();

        dragPageAction.setDragOverInfo(null);
        dragPageAction.setDraggingNode(null);
        if (prevSideKeyRef.current) {
            dragPageAction.setActiveSideKey(prevSideKeyRef.current);
            prevSideKeyRef.current = null;
        }
    }

    const THROTTLE_TIME = 50; // 如果卡顿，可以调整大一些
    const throttleOver = throttle((e) => {
        const isPropsToSet = draggingNode?.propsToSet;

        const targetElement = isPropsToSet ? getNodeEle(e.target) : getDroppableEle(e.target);

        if (!targetElement) return;

        const targetComponentId = targetElement.getAttribute('data-componentId');

        // 放在自身上
        if (draggingNode?.id === targetComponentId) return;

        const {pageX, pageY, clientX, clientY} = e;

        const position = getDropPosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: iframeDocument,
        });

        if (!position) return;

        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });

        if (!accept) {
            // e.dataTransfer.dropEffect = 'move';
            // e.dataTransfer.effectAllowed = 'copy';
            return;
        }

        dragPageAction.setDragOverInfo({
            targetElement,
            pageX,
            pageY,
            clientX,
            clientY,
            guidePosition: position.guidePosition,
        });
    }, THROTTLE_TIME);

    // 不要做任何导致当前页面render的操作，否则元素多了会很卡
    function handleDragOver(e) {
        e.stopPropagation();
        e.preventDefault();

        let cursor = 'move';

        const isCopy = draggingNode?.isNewAdd;
        if (isCopy) cursor = 'copy';

        const isPropsToSet = draggingNode?.propsToSet;
        if (isPropsToSet) cursor = 'link';

        e.dataTransfer.dropEffect = cursor;

        throttleOver(e);
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        const end = () => {
            handleDragLeave(e);
            handleDragEnd();
        };

        const propsToSet = e.dataTransfer.getData('propsToSet');

        if (propsToSet) {
            // 组件节点
            const nodeEle = getNodeEle(e.target);
            if (!nodeEle) return end();

            const newProps = JSON.parse(propsToSet);
            const componentId = nodeEle.getAttribute('data-componentId');

            dragPageAction.setNewProps({componentId, newProps});

            return end();
        }

        // 可投放元素
        const targetElement = getDroppableEle(e.target);
        if (!targetElement) return end();

        const targetComponentId = targetElement.getAttribute('data-componentId');

        const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
        let componentConfig = e.dataTransfer.getData('componentConfig');

        // 放在自身上
        if (targetComponentId === sourceComponentId) return end();

        const {pageX, pageY, clientX, clientY} = e;

        const position = getDropPosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement,
            frameDocument: iframeDocument,
        });

        if (!position) return end();
        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId,
            ...position,
        });
        if (!accept) return end();

        if (sourceComponentId) {
            dragPageAction.moveNode({
                sourceId: sourceComponentId,
                targetId: targetComponentId,
                ...position,
            });
            // dragPageAction.setSelectedNodeId(sourceComponentId);
        }

        if (componentConfig) {
            componentConfig = JSON.parse(componentConfig);

            dragPageAction.addNode({
                targetId: targetComponentId,
                node: componentConfig,
                ...position,
            });
            // dragPageAction.setSelectedNodeId(componentConfig.id);
        }
        end();
    }

    return (
        <div
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                padding: 1,
            }}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
        >
            {children}
        </div>
    );
};
