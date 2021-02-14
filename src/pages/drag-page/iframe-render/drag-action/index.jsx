import {useRef, useEffect} from 'react';
import {throttle} from 'lodash';
import {
    findNodeById,
    getDropPosition,
    isDropAccept,
    getNodeEle,
    getDroppableEle,
    setDragImage, handleNodDrop,
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
        setDragImage(e, node);
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
        const isWrapper = draggingNode?.isWrapper;

        // 选择一个目标，非投放
        const toSelectedTarget = isPropsToSet || isWrapper;

        const targetElement = toSelectedTarget ? getNodeEle(e.target) : getDroppableEle(e.target);

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
    }, THROTTLE_TIME, {trailing: false});

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

        handleNodDrop({
            e,
            iframeDocument,
            end,
            pageConfig,
            draggingNode,
            dragPageAction,
        });
    }

    useEffect(() => {
        if (!iframeDocument) return;
        iframeDocument.body.addEventListener('dragstart', handleDragStart);
        iframeDocument.body.addEventListener('dragover', handleDragOver);
        iframeDocument.body.addEventListener('dragleave', handleDragLeave);
        iframeDocument.body.addEventListener('dragend', handleDragEnd);
        iframeDocument.body.addEventListener('drop', handleDrop);

        return () => {
            iframeDocument.body.removeEventListener('dragstart', handleDragStart);
            iframeDocument.body.removeEventListener('dragover', handleDragOver);
            iframeDocument.body.removeEventListener('dragleave', handleDragLeave);
            iframeDocument.body.removeEventListener('dragend', handleDragEnd);
            iframeDocument.body.removeEventListener('drop', handleDrop);
        };
    });

    return children;
};
