import React, {useEffect} from 'react';
import config from 'src/commons/config-hoc';
import styles from './style.less';

export default config({
    connect: state => {
        return {
            arrowLines: state.dragPage.arrowLines,
        };
    },
})(function ArrowLines(props) {
    const {arrowLines} = props;
    useEffect(() => {
        // 清除
        if (!arrowLines?.length) {
            const allEle = document.querySelectorAll(`.${styles.root}`);
            allEle.forEach(ele => ele.remove());
        }

        arrowLines.forEach((item, index) => {
            // [{startX: 1000, startY: 100, endX: 500, endY: 300}].forEach(item => {
            const {
                startX,
                startY,
                endX,
                endY,
                showEndPoint,
            } = item;

            const allEle = document.querySelectorAll(`.${styles.root}`);
            let ele = Array.from(allEle)[index];

            if (!ele) {
                ele = document.createElement('div');
                document.body.append(ele);
            }

            ele.classList.add(styles.root);
            const w = Math.abs(startX - endX);
            const h = Math.abs(startY - endY);

            // 勾股定理算长度
            const width = Math.sqrt(w * w + h * h);

            // 计算旋转角度

            // 右下
            let deg = Math.atan(h / w) * 180 / Math.PI;
            // 右上
            if (endX > startX && endY < startY) deg = -deg;
            // 左上
            if (endX < startX && endY < startY) deg = -(180 - deg);
            // 左下
            if (endX < startX && endY > startY) deg = 180 - deg;

            ele.style.width = `${width}px`;
            ele.style.top = `${startY}px`;
            ele.style.left = `${startX}px`;
            ele.style.transform = `rotate(${deg}deg) scaleY(.5)`;
        });
    }, [arrowLines]);
    return null;
});
