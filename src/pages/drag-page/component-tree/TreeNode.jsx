import React, {useState, useRef} from 'react';
import config from 'src/commons/config-hoc';
import {getDropGuidePosition, isDropAccept} from 'src/pages/drag-page/util';
import {getComponentIcon} from '../base-components';
import {throttle} from 'lodash';
import classNames from 'classnames';

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

    let {key, name, isContainer, draggable, nodeData} = node;

    let icon = getComponentIcon(nodeData, isContainer);

    name = <span>{icon}{name}</span>;

    const hoverRef = useRef(0);
    const nodeRef = useRef(null);
    const [dragIn, setDragIn] = useState(false);
    const [dropPosition, setDropPosition] = useState('');

    function handleDragStart(e) {
        e.stopPropagation();

        if (!draggable) {
            const img = new Image();
            e.dataTransfer.setDragImage(img, 10, 10);

            return;
        }

        dragPageAction.setDraggingNode(nodeData);

        e.dataTransfer.setData('sourceComponentId', key);
    }

    function handleDragEnter(e) {
        if (!draggable) return;

        if (draggingNode?.__config?.componentId === key) return;
        setDragIn(true);
    }

    const THROTTLE_TIME = 100;
    const throttleOver = throttle(e => {
        const targetElement = e.target;

        if (!targetElement) return;

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
            targetElement,
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

        if (!accept) return;

        dragPageAction.setDragOverInfo({
            targetElementId: key,
            isTree: true,
            isTop,
            isBottom,
            isCenter,
        });

        if (isTop) setDropPosition('top');
        if (isBottom) setDropPosition('bottom');
        if (accept && isCenter) setDropPosition('center');
    }, THROTTLE_TIME);

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        const isCopy = draggingNode?.__config?.__fromStore;

        e.dataTransfer.dropEffect = isCopy ? 'copy' : 'move';

        if (!draggable) return;

        throttleOver(e);
    }

    function handleDragLeave(e) {
        if (!draggable) return;

        setDragIn(false);
        dragPageAction.setDragOverInfo(null);

        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
    }

    function handleDrop(e) {
        if (!draggable) return;

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
        if (!draggable) return;
        if (hoverRef.current) {
            clearTimeout(hoverRef.current);
            hoverRef.current = 0;
        }
        dragPageAction.setDraggingNode(null);
        dragPageAction.setDragOverInfo(null);
    }

    const isSelected = selectedKey === key;
    const isDragging = draggingNode?.__config?.componentId === key;

    const styleNames = classNames(dropPosition, {
        treeNode: true,
        selected: isSelected,
        dragging: isDragging,
        dragIn: dragIn && draggingNode,
        unDraggable: !draggable,
        hasDraggingNode: !!draggingNode,
    });

    const positionMap = {
        top: '前',
        bottom: '后',
        center: '内',
    };
    return (
        <div
            ref={nodeRef}
            key={key}
            id={`treeNode_${key}`}
            styleName={styleNames}
            draggable
            data-componentId={key}
            data-isContainer={isContainer}
            onDragStart={handleDragStart}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
        >
            {name}
            <div styleName="dragGuide" style={{display: dragIn && draggingNode ? 'flex' : 'none'}}>
                <span>{positionMap[dropPosition]}</span>
            </div>
        </div>
    );
});
