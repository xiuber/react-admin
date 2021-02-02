import React from 'react';
import {Collapse} from 'antd';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import Layout from './layout';
import './style.less';


const {Panel} = Collapse;


export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function ComponentStyle(props) {
    let {
        selectedNode = {},
    } = props;

    // 有 null 的情况
    if (!selectedNode) selectedNode = {};

    const {
        __config = {},
        componentName,
    } = selectedNode;
    const {
        componentDesc,
    } = __config;

    const currentName = componentDesc || componentName;

    return (
        <Pane
            fitHeight
            header={(
                <div>
                    当前选中: {currentName}
                </div>
            )}
        >
            <Collapse
                defaultActiveKey={['layout', 'text', 'position', 'background', 'border']}
            >
                <Panel header="布局" key="layout">
                    <Layout/>
                </Panel>
                <Panel header="文字" key="text">
                    文字
                </Panel>
                <Panel header="定位" key="position">
                    定位
                </Panel>

                <Panel header="背景" key="background">
                    背景
                </Panel>
                <Panel header="边框" key="border">
                    边框
                </Panel>
            </Collapse>
        </Pane>
    );
});
