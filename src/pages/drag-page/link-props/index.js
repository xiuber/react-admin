import React, {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import {throttle} from 'lodash';
import LinkPoint from 'src/pages/drag-page/link-props/LinkPoint';
import {getEleCenterInWindow} from 'src/pages/drag-page/util';

import './style.less';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
            iFrameDocument: state.dragPage.iFrameDocument,
        };
    },
})(function LinkProps(props) {
    const {
        selectedNode,
        iFrameDocument,
        action: {dragPage: dragPageAction},
    } = props;

    const propsToSet = selectedNode?.__config?.propsToSet;

    const startRef = useRef(null);
    const lineRef = useRef(null);
    const dragImgRef = useRef(null);


    function handleDragStart(e) {
        console.log('handleDragStart');
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

        dragPageAction.setArrowLines([options]);
    }

    // const handleHoverMouseMove = throttle(e => {}, 100);

    function handleOver(e) {
        e.preventDefault();
        if (!startRef.current) return;

        const {pageX, pageY, clientX, clientY} = e;
        const endX = pageX || clientX;
        const endY = pageY || clientY;

        showArrowLine({endX, endY});
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

        showArrowLine({endX, endY});
    }

    function showArrowLine({endX, endY}) {
        const options = {
            ...startRef.current,
            endX,
            endY,
        };

        lineRef.ref = options;
        dragPageAction.setArrowLines([options]);
    }

    function handleClick(e) {
        console.log('click');
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
