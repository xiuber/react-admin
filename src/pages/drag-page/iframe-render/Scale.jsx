import React, {useEffect, useState} from 'react';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import './Scale.less';

export default function Scale(props) {
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
        element.style.transformOrigin = 'left top';
    }, [element]);

    useEffect(() => {
        if (!element) return;

        element.style.transform = `scale(${scale / 100})`;
    }, [scale]);


    return (
        <div styleName="root">
            <PlusCircleOutlined disabled={scale >= max} onClick={handlePlus}/>
            <MinusCircleOutlined disabled={scale <= min} onClick={handleMinus}/>
            <RetweetOutlined onClick={handleReset}/>
            <span>{scale}%</span>
        </div>
    );

}
