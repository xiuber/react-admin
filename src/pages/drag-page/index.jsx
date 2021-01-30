import React, {useCallback, useRef, useEffect} from 'react';
import ReactDOM from 'react-dom';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import Element from './Element';
import Top from './top';
import Left from './left';
import Right from './right';
import KeyMap from './KeyMap';
import './style.less';


const iframeSrcDoc = `
<!DOCTYPE html>
<html lang="en">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
    <body>
        <div id="dnd-container"></div>
        <div id="drop-guide-line" style="display: none"><span>前</span></div>
    </body>
</html>
`;

export default config({
    path: '/drag-page',
    side: false,
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNodeId: state.dragPage.selectedNodeId,
            draggingNodeId: state.dragPage.draggingNodeId,
            dragPage: state.dragPage,
        };
    },
})(function DragPage(props) {
    const {dragPage, pageConfig, selectedNodeId, draggingNodeId} = props;
    const dragPageAction = props.action.dragPage;

    const iframeRef = useRef(null);
    const iframeRootRef = useRef(null);

    const renderDesignPage = useCallback(() => {
        const iframeDocument = iframeRef.current.contentDocument;
        const iframeRootEle = iframeRootRef.current;
        if (!iframeRootEle) return;

        ReactDOM.render(
            <Element
                config={pageConfig}
                dragPage={dragPage}
                draggingNodeId={draggingNodeId}
                dragPageAction={dragPageAction}
                iframeDocument={iframeDocument}
            />,
            iframeRootEle,
        );
    });

    const handleIframeLoad = useCallback(() => {
        const iframeDocument = iframeRef.current.contentDocument;
        const head = document.head.cloneNode(true);
        iframeDocument.head.remove();
        iframeDocument.documentElement.insertBefore(head, iframeDocument.body);

        iframeDocument.body.style.overflow = 'auto';

        iframeRootRef.current = iframeDocument.getElementById('dnd-container');

        renderDesignPage();

    }, [iframeRef.current]);

    useEffect(() => {
        renderDesignPage();
    }, [pageConfig, selectedNodeId, draggingNodeId]);

    return (
        <PageContent fitHeight styleName="root">
            <KeyMap iframe={iframeRef.current}/>
            <div styleName="top">
                <Top/>
            </div>
            <div styleName="main">
                <div styleName="left">
                    <Left/>
                </div>
                <div styleName="center">
                    <iframe
                        id="dnd-iframe"
                        title="dnd-iframe"
                        ref={iframeRef}
                        style={{border: 0, width: '100%', height: '100%'}}
                        srcDoc={iframeSrcDoc}
                        onLoad={useCallback(() => {
                            handleIframeLoad();
                        }, [iframeRef.current])}
                    />
                </div>
                <div styleName="right">
                    <Right/>
                </div>
            </div>
        </PageContent>
    );
});
