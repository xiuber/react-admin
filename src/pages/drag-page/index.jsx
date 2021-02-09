import React from 'react';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import Top from './top';
import Left from './left';
import Right from './right';
import IframeRender from './iframe-render';
import ArrowLines from './arrow-lines';

import './style.less';

export default config({
    path: '/drag-page',
    side: false,
})(function DragPage(props) {
    return (
        <PageContent fitHeight styleName="root">
            <div styleName="top">
                <Top/>
            </div>
            <div styleName="main">
                <div styleName="left">
                    <Left/>
                </div>
                <div styleName="center">
                    <IframeRender/>
                </div>
                <div styleName="right">
                    <Right/>
                </div>
            </div>
            <ArrowLines/>
        </PageContent>
    );
});
