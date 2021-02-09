import React, {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import LinkPoint from 'src/pages/drag-page/link-props/LinkPoint';
import {getEleCenterInWindow} from 'src/pages/drag-page/util';

import './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNode: state.dragPage.selectedNode,
            iFrameDocument: state.dragPage.iFrameDocument,
        };
    },
})(function LinkProps(props) {
    const {
        selectedNode,
        iFrameDocument,
        action: {dragPage: dragPageAction},
        pageConfig,
    } = props;

    const propsToSet = selectedNode?.__config?.propsToSet;

    const startRef = useRef(null);
    const lineRef = useRef(null);
    const dragImgRef = useRef(null);
    const arrowLinesRef = useRef(null);


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
    }

    function handleDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        const options = lineRef.ref;

        options.remove = true;

        dragPageAction.showDraggingArrowLine(options);
    }

    // const handleHoverMouseMove = throttle(e => {}, 100);

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
        };

        lineRef.ref = options;
        dragPageAction.showDraggingArrowLine(options);
    }

    function handleClick(e) {
        // 隐藏
        if (arrowLinesRef.current) {
            const all = arrowLinesRef.current;
            all.forEach(item => item.remove = true);

            dragPageAction.setArrowLines([...all]);
            arrowLinesRef.current = null;

            return;
        }

        // 显示

        // 获取所有关联元素
        const componentId = selectedNode?.__config?.componentId;

        if (!propsToSet) return;

        const center = getEleCenterInWindow(e.target);
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
        });
        arrowLinesRef.current = all;

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

            <LinkPoint/>
        </div>
    );
});
