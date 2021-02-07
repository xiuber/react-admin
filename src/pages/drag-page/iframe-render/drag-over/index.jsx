import {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {getDropGuidePosition, LINE_SIZE, /*TRIGGER_SIZE,*/ usePrevious} from 'src/pages/drag-page/util';

export default config({
    connect: state => {

        return {
            dragOverInfo: state.dragPage.dragOverInfo,
        };
    },
})(function DragOver(props) {
    const {
        frameDocument,
        dragOverInfo,
    } = props;
    const guideLineRef = useRef(null);
    const guideBgRef = useRef(null);
    const timeRef = useRef(0);
    const prevDragOverInfo = usePrevious(dragOverInfo);

    useEffect(() => {
        if (!frameDocument) return;

        guideLineRef.current = frameDocument.getElementById('drop-guide-line');
        guideBgRef.current = frameDocument.getElementById('drop-guide-bg');
    }, [frameDocument]);

    useEffect(() => {
        if (!guideLineRef.current) return;

        if (dragOverInfo) {
            let {
                targetElement,
                guidePosition,

                isTree,
                targetElementId,
                isTop,
                isBottom,
                isCenter,
            } = dragOverInfo;

            if (isTree) {
                targetElement = frameDocument.querySelector(`[data-componentid="${targetElementId}"]`);
                guidePosition = getDropGuidePosition({
                    targetElement,
                    frameDocument,
                });
                guidePosition.position = {
                    isTop,
                    isBottom,
                    isCenter,
                };

                const {target: {targetY, targetX, targetWidth, targetHeight}} = guidePosition;

                const halfY = targetY + targetHeight / 2;
                let top = isTop ? targetY : null;
                top = isBottom ? targetY + targetHeight - LINE_SIZE : top;
                top = isCenter ? halfY - LINE_SIZE / 2 : top;

                guidePosition.guideLine = {
                    left: targetX,
                    top,
                    width: targetWidth,
                    height: LINE_SIZE,
                };
            }

            clearTimeout(timeRef.current);
            showDropGuideLine(guidePosition);
            overElement({
                targetElement,
                targetRect: guidePosition.target.targetRect,
            });
        } else {
            let {
                targetElement,
                isTree,
                targetElementId,
            } = prevDragOverInfo;

            if (isTree) {
                targetElement = frameDocument.querySelector(`[data-componentid="${targetElementId}"]`);
            }

            leaveElement(targetElement);
            timeRef.current = setTimeout(() => hideDropGuide(), 100);
        }
    }, [dragOverInfo]);

    return null;
});

function leaveElement(targetElement) {
    targetElement.classList.remove(styles.largeY);
    targetElement.classList.remove(styles.largeX);
    targetElement.classList.remove(styles.dragOver);
}

function overElement(options) {
    const {
        targetElement,
        // targetRect,
    } = options;

    if (!targetElement) return;

    targetElement.classList.add(styles.dragOver);
    const isContainer = targetElement.getAttribute('data-isContainer') === 'true';

    // 如果是容器 鼠标悬停 放大
    if (isContainer) {
        // if (targetRect.height < TRIGGER_SIZE * 3) {
        //     targetElement.classList.add(styles.largeY);
        // }
        // if (targetRect.width < TRIGGER_SIZE * 3) {
        //     targetElement.classList.add(styles.largeX);
        // }
    }

}

function showDropGuideLine(position) {
    let {
        guideLine: {
            top,
            left,
            width,
            height,
        },
        position: {
            isCenter,
            isLeft,
            isRight,
            isTop,
            isBottom,
        },
        target: {
            targetHeight,
            targetWidth,
            targetX,
            targetY,
        },
    } = position;

    if (isLeft || isRight) {
        isCenter = false;
        isTop = false;
        isBottom = false;
    }

    const guidePosition = {
        top,
        width,
        height,
        left,
    };

    const frameDocument = document.getElementById('dnd-iframe').contentDocument;
    const guideLineEle = frameDocument.getElementById('drop-guide-line');

    if (!guideLineEle) return;

    const guideBgEle = frameDocument.getElementById('drop-guide-bg');
    guideBgEle.classList.add(styles.guideBgActive);
    guideBgEle.style.top = `${targetY}px`;
    guideBgEle.style.left = `${targetX}px`;
    guideBgEle.style.width = `${targetWidth}px`;
    guideBgEle.style.height = `${targetHeight}px`;

    const guildTipEle = guideLineEle.querySelector('span');
    guideLineEle.classList.add(styles.guideActive);
    guideLineEle.classList.remove(styles.gLeft);
    guideLineEle.classList.remove(styles.gRight);

    if (isLeft) {
        guildTipEle.innerHTML = '前';
        guideLineEle.classList.add(styles.gLeft);
    }
    if (isRight) {
        guildTipEle.innerHTML = '后';
        guideLineEle.classList.add(styles.gRight);
    }
    if (isTop) guildTipEle.innerHTML = '前';
    if (isBottom) guildTipEle.innerHTML = '后';
    if (isCenter) guildTipEle.innerHTML = '内';

    Object.entries(guidePosition).forEach(([key, value]) => {
        guideLineEle.style[key] = `${value}px`;
    });
}

function hideDropGuide() {
    const frameDocument = document.getElementById('dnd-iframe').contentDocument;

    const guideLineEle = frameDocument.getElementById('drop-guide-line');
    const guideBgEle = frameDocument.getElementById('drop-guide-bg');

    guideBgEle && guideBgEle.classList.remove(styles.guideBgActive);
    guideLineEle && guideLineEle.classList.remove(styles.guideActive);
}
