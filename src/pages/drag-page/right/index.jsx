import React, {useState, useEffect} from 'react';
import {Tabs} from 'antd';
import config from 'src/commons/config-hoc';
import ComponentStyle from '../component-style';
import ComponentProps from '../component-props';
import './style.less';

const {TabPane} = Tabs;

export default config({
    connect: state => {
        return {
            activeTabKey: state.dragPage.activeTabKey,
            selectedNode: state.dragPage.selectedNode,
            draggingNode: state.dragPage.draggingNode,
        };
    },
})(function Right(props) {
    const {
        activeTabKey,
        selectedNode,
        draggingNode,
        action: {dragPage: dragPageAction},
    } = props;
    const [key, setKey] = useState(null);

    function handleChange(key) {
        dragPageAction.setActiveTabKey(key);
    }

    // 当前选中组件改变之后，设置key，使组件重新创建
    useEffect(() => {
        if (draggingNode) return;
        setKey(selectedNode?.__config?.componentId);
    }, [selectedNode, draggingNode]);

    return (
        <div key={key} styleName="root">
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
