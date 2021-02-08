import React, {useEffect, useState} from 'react';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import './style.less';

export default function Index(props) {
    const {element} = props;

    const init = 100;
    const step = 20;
    const min = 40;
    const max = 200;

    const [scale, setScale] = useState(init);

    function handlePlus() {
        if (scale >= max) return;
        setScale(scale + step);
    }

    function handleMinus() {
        if (scale <= min) return;

        setScale(scale - step);
    }

    function handleReset() {
        setScale(init);
    }

    useEffect(() => {
        if (!element) return;
        let origin = 'left top';
        if (scale < init) origin = 'top';

        element.style.transformOrigin = origin;
        element.style.transform = `scale(${scale / 100})`;
    }, [element, scale]);

    return (
        <div styleName="root">
            <PlusCircleOutlined disabled={scale >= max} onClick={handlePlus}/>
            <MinusCircleOutlined disabled={scale <= min} onClick={handleMinus}/>
            <RetweetOutlined onClick={handleReset}/>
            <span>{scale}%</span>
        </div>
    );

}
