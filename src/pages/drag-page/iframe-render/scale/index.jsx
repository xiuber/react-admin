import React, {useEffect, useState} from 'react';
import {
    PlusCircleOutlined,
    MinusCircleOutlined,
    RetweetOutlined,
} from '@ant-design/icons';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import './style.less';

const INIT = 100;
const STEP = 10;
const MIN = 10;
const MAX = 200;

export default function Index(props) {
    const {element} = props;

    const [scale, setScale] = useState(INIT);

    function handlePlus() {
        if (scale >= MAX) return;
        setScale(scale + STEP);
    }

    function handleMinus() {
        if (scale <= MIN) return;

        setScale(scale - STEP);
    }

    function handleReset() {
        setScale(INIT);
    }

    useEffect(() => {
        if (!element) return;
        let origin = 'left top';
        if (scale < INIT) origin = 'top';

        element.style.transformOrigin = origin;
        element.style.transform = `scale(${scale / 100})`;
    }, [element, scale]);

    return (
        <div styleName="root">
            <PlusCircleOutlined disabled={scale >= MAX} onClick={handlePlus}/>
            <MinusCircleOutlined disabled={scale <= MIN} onClick={handleMinus}/>
            <RetweetOutlined onClick={handleReset}/>
            <span styleName="inputWrapper">
                <UnitInput
                    allowClear={false}
                    value={scale}
                    onChange={e => setScale(e.target.value)}
                />
                %
            </span>
        </div>
    );

}
