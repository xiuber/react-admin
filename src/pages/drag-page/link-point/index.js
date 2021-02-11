import React, {useEffect, useRef, useState} from 'react';
import {Tooltip} from 'antd';
import config from 'src/commons/config-hoc';
import {getEleCenterInWindow, findNodeById, findLinkTargetsPosition} from 'src/pages/drag-page/util';
// import {v4 as uuid} from 'uuid';
import {throttle} from 'lodash';

import styles from './style.less';
import {getComponentConfig} from 'src/pages/drag-page/component-config';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNode: state.dragPage.selectedNode,
            iframeDocument: state.dragPage.iframeDocument,
        };
    },
})(function LinkProps(props) {
    const {
        selectedNode,
        iframeDocument,
        action: {dragPage: dragPageAction},
        className,
        onDragStart,
        movingPoint,
        pageConfig,
        ...others
    } = props;

    const nodeConfig = getComponentConfig(selectedNode?.componentName);

    const propsToSet = nodeConfig.propsToSet;

    const startRef = useRef(null);
    const lineRef = useRef(null);
    const pointRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const showDraggingArrowLine = throttle(({endX, endY}) => {
        const options = {
            ...startRef.current,
            endX,
            endY,
            key: 'dragging',
        };

        lineRef.ref = options;
        dragPageAction.showDraggingArrowLine(options);
    }, 1000 / 70, {trailing: false}); // 最后一次不触发

    function handleDragStart(e) {
        onDragStart && onDragStart(e);
        e.stopPropagation();
        // e.preventDefault();
        const componentId = selectedNode?.id;

        if (!propsToSet) return;
        setDragging(true);
        let str = JSON.stringify(propsToSet);

        str = str.replace(/\$\{componentId}/g, componentId);

        e.dataTransfer.setData('propsToSet', str);

        dragPageAction.setDraggingNode({propsToSet: true});

        const center = getEleCenterInWindow(e.target);
        if (center) {
            const {x: startX, y: startY} = center;
            startRef.current = {startX, startY};
        }

        const img = new Image();
        img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQYV2NgAAIAAAUAAarVyFEAAAAASUVORK5CYII=';

        e.dataTransfer.setDragImage(img, 0, 0);

        // 显示所有 link line
        dragPageAction.setShowArrowLines(true);
    }

    function handleDragEnd(e) {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);

        if (movingPoint) {
            const {targetComponentId, propsKey, propsValue} = movingPoint;

            const node = findNodeById(pageConfig, targetComponentId);
            if (node) {
                const props = node.props || {};

                Object.entries(props)
                    .forEach(([key, value]) => {
                        if (key === propsKey && value === propsValue) {
                            Reflect.deleteProperty(props, key);
                            // props.key = uuid();
                        }
                    });
                dragPageAction.render();
            }
        }

        dragPageAction.setRefreshArrowLines({});
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
        if (!startRef.current) return;

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

    function handleClick() {
        // 不传递参数，标识toggle
        dragPageAction.setShowArrowLines();
    }

    useEffect(() => {
        if (!iframeDocument) return;
        if (!dragging) return;

        // 捕获方式
        iframeDocument.addEventListener('dragover', handleIframeOver, true);
        window.addEventListener('dragover', handleOver, true);
        return () => {
            iframeDocument.removeEventListener('dragover', handleIframeOver, true);
            window.removeEventListener('dragover', handleOver, true);
        };
    }, [iframeDocument, dragging]);

    const links = movingPoint ? [] : findLinkTargetsPosition({
        pageConfig,
        selectedNode,
        iframeDocument,
    });

    const pointElement = (
        <div
            className={[
                className,
                styles.root,
                !links?.length && !movingPoint ? styles.noLink : '',
            ].join(' ')}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={handleClick}
            {...others}
        >
            <div className={styles.point} ref={pointRef}/>
        </div>
    );

    if (movingPoint) return pointElement;


    return (
        <Tooltip
            title={`已关联(${links?.length || 0})，点击查看所有，拖拽指定关联`}
            placement="top"
            getPopupContainer={() => document.body}
        >
            {pointElement}
        </Tooltip>
    );
});
