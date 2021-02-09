import React, {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import {getEleCenterInWindow} from 'src/pages/drag-page/util';

import './style.less';


export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNode: state.dragPage.selectedNode,
            selectedNodeId: state.dragPage.selectedNodeId,
            iFrameDocument: state.dragPage.iFrameDocument,
        };
    },
})(function LinkProps(props) {
    const {
        selectedNode,
        selectedNodeId,
        iFrameDocument,
        action: {dragPage: dragPageAction},
        pageConfig,
    } = props;

    const propsToSet = selectedNode?.__config?.propsToSet;

    const startRef = useRef(null);
    const lineRef = useRef(null);
    const dragImgRef = useRef(null);
    const pointRef = useRef(null);

    function handleDragStart(e) {
        e.stopPropagation();
        // e.preventDefault();
        const componentId = selectedNode?.__config?.componentId;

        if (!propsToSet) return;
        let str = JSON.stringify(propsToSet);

        str = str.replace(/\$\{componentId}/g, componentId);

        e.dataTransfer.setData('propsToSet', str);

        dragPageAction.setDraggingNode({propsToSet: true});

        const center = getEleCenterInWindow(e.target);
        if (center) {
            const {x: startX, y: startY} = center;
            startRef.current = {startX, startY};
        }

        e.dataTransfer.setDragImage(dragImgRef.current, 0, 0);
        showAllArrowLines();
    }

    function handleDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();

        selectedNode.__config.showLink = true;
        dragPageAction.setSelectedNode({...selectedNode});
    }

    function handleOver(e) {
        e.preventDefault();
        if (!startRef.current) return;

        const {pageX, pageY, clientX, clientY} = e;
        const endX = pageX || clientX;
        const endY = pageY || clientY;

        showDraggingArrowLine({endX, endY});
    }

    function handleIframeOver(e) {
        e.preventDefault();
        const {pageX, pageY, clientX, clientY} = e;
        let endX = pageX || clientX;
        let endY = pageY || clientY;
        const iframe = document.getElementById('dnd-iframe');
        const rect = iframe.getBoundingClientRect();
        const {x, y} = rect;

        endX = endX + x;
        endY = endY + y;

        showDraggingArrowLine({endX, endY});
    }

    function showDraggingArrowLine({endX, endY}) {
        const options = {
            ...startRef.current,
            endX,
            endY,
            key: 'dragging',
        };

        lineRef.ref = options;
        dragPageAction.showDraggingArrowLine(options);
    }

    function handleClick() {
        selectedNode.__config.showLink = !selectedNode.__config.showLink;
        dragPageAction.setSelectedNode({...selectedNode});
    }

    function showAllArrowLines() {
        // 获取所有关联元素
        const componentId = selectedNode?.__config?.componentId;

        if (!propsToSet) return;

        const center = getEleCenterInWindow(pointRef.current);
        const {x: startX, y: startY} = center;

        let all = [];
        Object.entries(propsToSet).forEach(([key, value]) => {
            const str = value.replace(/\$\{componentId}/g, componentId);
            const result = findLinkElementPosition(key, str);
            all = all.concat(result);
        });

        const iframe = document.getElementById('dnd-iframe');
        const rect = iframe.getBoundingClientRect();
        const {x, y} = rect;

        all.forEach(item => {
            item.endX = item.endX + x;
            item.endY = item.endY + y;
            item.startX = startX;
            item.startY = startY;
            item.showEndPoint = true;
        });

        dragPageAction.setArrowLines(all);
    }

    function findLinkElementPosition(key, value) {
        const result = [];
        const loop = (node) => {
            let {props} = node;
            if (!props) props = {};

            if (props[key] === value) {
                const componentId = node?.__config?.componentId;
                const ele = iFrameDocument.querySelector(`[data-componentId="${componentId}"]`);
                if (ele) {
                    const {x, y, width, height} = ele.getBoundingClientRect();

                    result.push({
                        key: `${value}__${componentId}`,
                        endX: x + width / 2,
                        endY: y + height / 2,
                    });
                }
            }
            if (node.children?.length) {
                node.children.forEach(item => loop(item));
            }
        };

        loop(pageConfig);

        return result;
    }

    // 显示隐藏
    useEffect(() => {
        if (!pointRef.current) return;
        const showLink = selectedNode?.__config?.showLink;
        if (showLink) {
            showAllArrowLines();
        } else {
            selectedNode.__config.showLink = false;
            dragPageAction.setArrowLines([]);
        }
    }, [selectedNode, pointRef.current]);

    // 选中节点更改，清空line
    useEffect(() => {
        dragPageAction.setArrowLines([]);
    }, [selectedNodeId]);

    useEffect(() => {
        if (!iFrameDocument) return;

        // 捕获方式
        iFrameDocument.addEventListener('dragover', handleIframeOver, true);
        window.addEventListener('dragover', handleOver, true);
        return () => {
            iFrameDocument.removeEventListener('dragover', handleIframeOver, true);
            window.removeEventListener('dragover', handleOver, true);
        };
    }, [iFrameDocument]);

    if (!propsToSet) return null;

    return (
        <div
            styleName="root"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
        >
            <img ref={dragImgRef} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=" alt=""/>

            <div styleName="point" ref={pointRef}/>
        </div>
    );
});
