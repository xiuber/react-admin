import React from 'react';
import config from 'src/commons/config-hoc';
import {PageContent} from 'ra-lib';
import {Tabs} from 'antd';
import Top from './top';
import Left from './left';
import Right from './right';
import IframeRender from './iframe-render';
import ArrowLines from './arrow-lines';
import KeyMap from './KeyMap';
import './style.less';
import TabPane from './components/tab-pane';

export default config({
    path: '/drag-page',
    side: false,
})(function DragPage(props) {
    return (
        <PageContent fitHeight styleName="root">
            <Tabs defaultActiveKey="1">
                <TabPane tab="Tab 1" key="1">
                    Content of Tab Pane 1
                </TabPane>
                <TabPane tab="Tab 2" key="2">
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                </TabPane>
            </Tabs>
            <KeyMap/>
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
