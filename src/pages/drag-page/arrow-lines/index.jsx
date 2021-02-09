import React from 'react';
import classNames from 'classnames';
import config from 'src/commons/config-hoc';
import styles from './style.less';

export default config({
    connect: state => {
        return {
            arrowLines: state.dragPage.arrowLines,
        };
    },
})(function ArrowLines(props) {
    const {
        arrowLines,
    } = props;

    function getStyle(item) {
        const {
            startX,
            startY,
            endX,
            endY,
        } = item;

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

        return {
            top: startY,
            left: startX,
            width: width,
            transform: `rotate(${deg}deg) scaleY(.5)`,
        };
    }

    return (
        <div>
            {arrowLines.map(item => {
                const {
                    showEndPoint,
                    remove,
                    dragging,
                    key,
                } = item;

                const styleNames = classNames({
                    [styles.root]: true,
                    [styles.showEndPoint]: showEndPoint,
                    [styles.remove]: remove,
                    [styles.dragging]: dragging,
                });

                const style = getStyle(item);

                return (
                    <div key={key} className={styleNames} style={style}>
                        <div className={styles.point}/>
                    </div>
                );
            })}
        </div>
    );
});
