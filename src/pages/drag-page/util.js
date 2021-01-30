export const LINE_SIZE = 1;
export const TRIGGER_SIZE = 20;

export const isMac = /macintosh|mac os x/i.test(navigator.userAgent);

export function getDropGuidePosition(options) {

    const {
        event,
        targetElement,
        triggerSize = TRIGGER_SIZE,
        isContainer,
        isInFrame = true,
    } = options;

    const targetIsContainer = isContainer === undefined ? targetElement.getAttribute('data-isContainer') : isContainer;

    const targetRect = targetElement.getBoundingClientRect();
    const {
        left: targetX,
        top: targetY,
        width: targetWidth,
        height: targetHeight,
    } = targetRect;

    const _document = isInFrame ? document.getElementById('dnd-iframe').contentDocument : document;

    const scrollX = _document.documentElement.scrollLeft || _document.body.scrollLeft;
    const scrollY = _document.documentElement.scrollTop || _document.body.scrollTop;
    const x = event.pageX || event.clientX + scrollX;
    const y = event.pageY || event.clientY + scrollY;


    const halfY = targetY + targetHeight / 2;
    const halfX = targetX + targetWidth / 2;

    let isTop;
    let isBottom;
    let isLeft;
    let isRight;
    let isCenter = false;

    if (targetIsContainer) {
        isTop = y < targetY + triggerSize;
        isBottom = y > targetY + targetHeight - triggerSize;
        isLeft = x < targetX + triggerSize;
        isRight = x > targetX + targetWidth - triggerSize;
        isCenter = y >= targetY + triggerSize && y <= targetY + targetHeight - triggerSize;
    } else {
        isTop = y < halfY;
        isBottom = !isTop;
        isLeft = x < halfX;
        isRight = !isLeft;
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

    return {
        isTop,
        isBottom,
        isCenter,
        isLeft,
        isRight,
        ...guidePosition,
    };
}
