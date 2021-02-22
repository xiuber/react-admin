import React, {useRef, useEffect} from 'react';
import config from 'src/commons/config-hoc';
import {SwapLeftOutlined, SwapRightOutlined} from '@ant-design/icons';
import '../top/style.less';

// 触发记录的频率
const FREQUENCY = 1000;

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            pageConfigHistory: state.dragPage.pageConfigHistory,
            historyCursor: state.dragPage.historyCursor,
            refreshProps: state.dragPage.refreshProps,
        };
    },
})(function Undo(props) {
    const {
        pageConfigHistory,
        historyCursor,
        pageConfig,
        refreshProps,
        action: {dragPage: dragPageAction},
    } = props;
    const fromUndoRef = useRef(true);
    const timeRef = useRef(0);

    function handlePrev() {
        fromUndoRef.current = true;
        dragPageAction.prevStep();
    }

    function handleNext() {
        fromUndoRef.current = true;
        dragPageAction.nextStep();
    }

    useEffect(() => {
        if (fromUndoRef.current) {
            fromUndoRef.current = false;
            return;
        }

        if (timeRef.current) {
            clearTimeout(timeRef.current);
        }

        timeRef.current = setTimeout(() => {
            dragPageAction.addPageConfigHistory(pageConfig);
        }, FREQUENCY);

    }, [JSON.stringify(pageConfig), refreshProps]);

    const disabledPrev = !pageConfigHistory?.length || historyCursor <= 0;
    const disabledNext = !pageConfigHistory?.length || historyCursor >= pageConfigHistory?.length - 1;

    return (
        <>
            <div styleName={`toolItem ${disabledPrev ? 'disabled' : ''}`} onClick={disabledPrev ? undefined : handlePrev}>
                <span styleName="icon"><SwapLeftOutlined/></span>
                <span styleName="label">上一步</span>
            </div>
            <div styleName={`toolItem ${disabledNext ? 'disabled' : ''}`} onClick={disabledNext ? undefined : handleNext}>
                <span styleName="icon"><SwapRightOutlined/></span>
                <span styleName="label">下一步</span>
            </div>
        </>
    );
});
