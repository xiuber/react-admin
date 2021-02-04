import React from 'react';
import {Tabs} from 'antd';
import config from 'src/commons/config-hoc';
import ComponentStyle from '../component-style';
import ComponentProps from '../component-props';
import DragBar from '../drag-bar';
import './style.less';

const {TabPane} = Tabs;

export default config({
    connect: state => {
        return {
            activeTabKey: state.dragPage.activeTabKey,
            selectedNode: state.dragPage.selectedNode,
            draggingNode: state.dragPage.draggingNode,
            rightSideWidth: state.dragPage.rightSideWidth,
        };
    },
})(function Right(props) {
    const {
        activeTabKey,
        // selectedNode,
        // draggingNode,
        rightSideWidth,
        action: {dragPage: dragPageAction},
    } = props;

    function handleChange(key) {
        dragPageAction.setActiveTabKey(key);
    }

    const windowWidth = document.documentElement.clientWidth;

    function handleDragging(info) {
        const {clientX} = info;

        const width = windowWidth - clientX - 12;

        dragPageAction.setRightSideWidth(width);
    }

    function handleDragEnd() {
        // console.log('handleDragEnd');
        // window.dispatchEvent(new Event('resize'));
        // setTimeout(() => window.dispatchEvent(new Event('resize')));
        // setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }

    return (
        <div styleName="root" style={{width: rightSideWidth}}>
            <DragBar
                onDragging={handleDragging}
                onDragEnd={handleDragEnd}
            />
            <Tabs
                type="card"
                tabBarStyle={{marginBottom: 0}}
                activeKey={activeTabKey}
                onChange={handleChange}
            >
                <TabPane tab="属性" key="attribute">
                    <ComponentProps/>
                </TabPane>
                <TabPane tab="样式" key="style">
                    <ComponentStyle/>
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
