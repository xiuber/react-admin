import React, {useState, useRef} from 'react';
import config from 'src/commons/config-hoc';
import {getDropGuidePosition, isDropAccept} from 'src/pages/drag-page/util';
import {getComponentIcon} from '../base-components';

import './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            draggingNode: state.dragPage.draggingNode,
            componentTreeExpendedKeys: state.dragPage.componentTreeExpendedKeys,
        };
    },
})(function TreeNode(props) {
    const {
        node,
        selectedKey,
        pageConfig,
        draggingNode,
        componentTreeExpendedKeys,
        action: {dragPage: dragPageAction},
    } = props;

    let {key, title, isContainer, draggable, nodeData} = node;

    let icon = getComponentIcon(nodeData, isContainer);

    title = <span>{icon}{title}</span>;

    const hoverRef = useRef(0);
    const nodeRef = useRef(null);
    const [dragIn, setDragIn] = useState(false);
    const [dropPosition, setDropPosition] = useState('');

    function handleDragStart(e) {
        e.stopPropagation();

        dragPageAction.setDraggingNode(nodeData);

        e.dataTransfer.setData('sourceComponentId', key);
    }

    function handleDragEnter(e) {
        if (draggingNode?.__config?.componentId === key) return;
        setDragIn(true);
    }

    function handleDragOver(e) {
        if (draggingNode?.__config?.componentId === key) return;

        // 1s 后展开节点
        if (!hoverRef.current) {
            hoverRef.current = setTimeout(() => {
                if (!componentTreeExpendedKeys.some(k => k === key)) {
                    dragPageAction.setComponentTreeExpendedKeys([...componentTreeExpendedKeys, key]);
                }
            }, 500);
        }
        const {pageX, pageY, clientX, clientY} = e;

        const {position} = getDropGuidePosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement: e.target,
            frameDocument: window.document,
        });
        const {isTop, isBottom, isCenter} = position;

        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId: key,
            isBefore: isTop,
            isAfter: isBottom,
            isChildren: isCenter,
        });

        setDropPosition('');
        setDragIn(true);

        if (!accept) {
            setDragIn(false);
            return;
        }

        if (isTop) setDropPosition('top');
        if (isBottom) setDropPosition('bottom');
        if (accept && isCenter) setDropPosition('center');
    }

    function handleDragLeave(e) {
        setDragIn(false);

        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const end = () => {
            handleDragLeave(e);
            handleDragEnd();
        };

        const sourceComponentId = e.dataTransfer.getData('sourceComponentId');
        let componentConfig = e.dataTransfer.getData('componentConfig');

        if (key === sourceComponentId) return end();

        const {pageX, pageY, clientX, clientY} = e;

        const {position} = getDropGuidePosition({
            pageX,
            pageY,
            clientX,
            clientY,
            targetElement: e.target,
            frameDocument: window.document,
        });

        const {isTop, isBottom, isCenter} = position;


        const accept = isDropAccept({
            draggingNode,
            pageConfig,
            targetComponentId: key,
            isBefore: isTop,
            isAfter: isBottom,
            isChildren: isCenter,
        });

        if (!accept) return end();

        if (sourceComponentId) {
            dragPageAction.moveNode({
                sourceId: sourceComponentId,
                targetId: key,
                isBefore: isTop,
                isAfter: isBottom,
                isChildren: isCenter,
            });
            dragPageAction.setSelectedNodeId(sourceComponentId);
        }

        if (componentConfig) {
            componentConfig = JSON.parse(componentConfig);
            dragPageAction.addNode({
                targetId: key,
                isBefore: isTop,
                isAfter: isBottom,
                isChildren: isCenter,
                node: componentConfig,
            });
            dragPageAction.setSelectedNodeId(componentConfig.__config?.componentId);
        }

        end();
    }

    function handleDragEnd() {
        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
        dragPageAction.setDraggingNode(null);
    }

    const isSelected = selectedKey === key;
    const isDragging = draggingNode?.__config?.componentId === key;
    const styleNames = ['treeNode'];

    if (isSelected) styleNames.push('selected');
    if (isDragging) styleNames.push('dragging');
    if (dragIn && draggingNode) styleNames.push('dragIn');

    styleNames.push(dropPosition);

    const positionMap = {
        top: '上',
        bottom: '下',
        center: '内',
    };
    return (
        <div
            ref={nodeRef}
            key={key}
            id={`treeNode_${key}`}
            styleName={styleNames.join(' ')}
            draggable={draggable}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
        >
            {title}
            <div styleName="dragGuide" style={{display: dragIn && draggingNode ? 'flex' : 'none'}}>
                <span>{positionMap[dropPosition]}</span>
            </div>
        </div>
    );
});
