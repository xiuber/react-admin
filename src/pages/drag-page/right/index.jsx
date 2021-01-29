import React from 'react';
import {Tabs} from 'antd';
import config from 'src/commons/config-hoc';

const {TabPane} = Tabs;

export default config({
    connect: state => {
        return {
            activeTabKey: state.dragPage.activeTabKey,
        };
    },
})(function Right(props) {

    const {activeTabKey, action: {dragPage: dragPageAction}} = props;

    function handleChange(key) {
        dragPageAction.setActiveTabKey(key);
    }

    return (
        <div style={{width: 300}}>
            <Tabs
                type="card"
                activeKey={activeTabKey}
                onChange={handleChange}
            >
                <TabPane tab="属性" key="attribute">
                    Content of Tab Pane 2
                </TabPane>
                <TabPane tab="样式" key="style">
                    Content of Tab Pane 1
                </TabPane>
                <TabPane tab="事件" key="action">
                    Content of Tab Pane 3
                </TabPane>
                <TabPane tab="数据" key="dataSource">
                    Content of Tab Pane 3
                </TabPane>
            </Tabs>
        </div>
    );
});
