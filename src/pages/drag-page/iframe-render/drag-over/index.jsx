import {useEffect, useRef} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';
import {LINE_SIZE, TRIGGER_SIZE} from 'src/pages/drag-page/util';

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

    useEffect(() => {
        if (!frameDocument) return;

        guideLineRef.current = frameDocument.getElementById('drop-guide-line');
        guideBgRef.current = frameDocument.getElementById('drop-guide-bg');
    }, [frameDocument]);

    useEffect(() => {
        if (!guideLineRef.current) return;

        if (dragOverInfo) {
            const {
                targetElement,
                pageX,
                pageY,
                clientX,
                clientY,
            } = dragOverInfo;

            // 获取位置
            const position = getDropGuidePosition({
                pageX,
                pageY,
                clientX,
                clientY,
                frameDocument,
                targetElement,
            });
            // console.log(position.guideLine);

            clearTimeout(timeRef.current);
            showDropGuideLine(position);
        } else {
            timeRef.current = setTimeout(() => hideDropGuide(), 300);
        }
    }, [dragOverInfo]);

    return null;
});

export function getDropGuidePosition(options) {
    const {
        pageX,
        pageY,
        clientX,
        clientY,
        targetElement,
        frameDocument,
    } = options;

    const triggerSize = TRIGGER_SIZE;

    const targetIsContainer = targetElement.getAttribute('data-isContainer') === 'true';
    const targetRect = targetElement.getBoundingClientRect();

    const documentElement = frameDocument.documentElement || frameDocument.body;
    const windowHeight = documentElement.clientHeight;
    const windowWidth = documentElement.clientWidth;

    const scrollX = documentElement.scrollLeft;
    const scrollY = documentElement.scrollTop;

    const x = pageX || clientX + scrollX;
    const y = pageY || clientY + scrollY;

    let {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    // 获取可视范围
    if (targetY < 0) {
        targetHeight = targetHeight + targetY;
        targetY = 0;
    }
    if (targetHeight + targetY > windowHeight) targetHeight = windowHeight - targetY;

    if (targetX < 0) {
        targetWidth = targetWidth + targetX;
        targetX = 0;
    }
    if (targetWidth + targetX > windowWidth) targetWidth = windowWidth - targetX;


    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + triggerSize;
        isRight = x > targetX + targetWidth - triggerSize;
        isBottom = y > targetY + targetHeight - triggerSize;
        isLeft = x < targetX + triggerSize;
        isCenter = y >= targetY + triggerSize && y <= targetY + targetHeight - triggerSize;
    } else {
        isTop = y < halfY;
        isRight = !isLeft;
        isBottom = !isTop;
        isLeft = x < halfX;
    }

    let guidePosition;
    if (isLeft || isRight) {
        const left = isLeft ? targetX : targetX + targetWidth - LINE_SIZE;

        guidePosition = {
            left,
            top: targetY,
            height: targetHeight,
            width: LINE_SIZE,
        };
    } else {
        let top = isTop ? targetY : null;
        top = isBottom ? targetY + targetHeight - LINE_SIZE : top;
        top = isCenter ? halfY - LINE_SIZE / 2 : top;

        guidePosition = {
            left: targetX,
            top,
            width: targetWidth,
            height: LINE_SIZE,
        };
    }

    const position = {
        isTop,
        isBottom,
        isCenter,
        isLeft,
        isRight,
    };


    const target = {
        targetHeight,
        targetWidth,
        targetX,
        targetY,
        targetRect,
    };

    return {
        position,
        guideLine: guidePosition,
        target,
    };
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
    if (isTop) guildTipEle.innerHTML = '上';
    if (isBottom) guildTipEle.innerHTML = '下';
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
