import {useEffect} from 'react';
import config from 'src/commons/config-hoc';

export default config({
    connect: state => {
        return {
            selectedNodeId: state.dragPage.selectedNodeId,
            activeSideKey: state.dragPage.activeSideKey,
            showSide: state.dragPage.showSide,
        };
    },
})(function KeyMap(props) {
    const {
        iframe,
        activeSideKey,
        showSide,
        action: {dragPage: dragPageAction},
    } = props;

    function handleKeyDown(e) {
        const {key, metaKey, ctrlKey} = e;
        const mc = metaKey || ctrlKey;

        if (mc && key === 'd') {
            e.preventDefault();
            dragPageAction.deleteSelectedNode();
        }

        if (mc && key === 's') {
            e.preventDefault();
            console.log(showSide, activeSideKey);
            (() => {
                if (showSide && activeSideKey === 'schemaEditor') {
                    dragPageAction.saveSchema();
                    return;
                }

                // TODO 区分保存左侧，右侧编辑框 还是中间编辑内容
                dragPageAction.save();
            })();
        }
    }

    useEffect(() => {
        if (iframe) {
            const iframeDocument = iframe.contentDocument;
            iframeDocument.addEventListener('keydown', handleKeyDown);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (iframe) {
                const iframeDocument = iframe.contentDocument;
                iframeDocument.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [iframe, activeSideKey, showSide]);
    return null;
});
