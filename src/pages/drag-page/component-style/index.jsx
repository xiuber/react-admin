import React, { useState } from 'react';
import { Collapse } from 'antd';
import { DesktopOutlined } from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import Layout from './layout';
import Font from './font';
import Position from './position';
import Background from './background';
import StyleEditor from './style-editor';
import './style.less';


const { Panel } = Collapse;


export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function ComponentStyle(props) {
    let {
        selectedNode = {},
        action: { dragPage: dragPageAction },
    } = props;

    // 有 null 的情况
    if (!selectedNode) selectedNode = {};

    const {
        __config = {},
        componentName,
        props: componentProps = {},
    } = selectedNode;
    const {
        componentDesc,
    } = __config;

    const {
        style = {},
    } = componentProps;

    const currentName = componentDesc || componentName;

    const [styleEditorVisible, setStyleEditorVisible] = useState(false);

    function handleChange(values, replace) {
        if (!selectedNode?.componentName) return;

        if (!selectedNode?.props) selectedNode.props = {};

        if (!selectedNode.props.style) selectedNode.props.style = {};

        const style = selectedNode.props.style;

        if (replace) {
            selectedNode.props.style = values;
        } else {
            selectedNode.props.style = {
                ...style,
                ...values,
            };
        }

        // 使props改变，Element会重新设置key，从新加载
        selectedNode.props = { ...selectedNode.props };

        console.log('selectedNode style', JSON.stringify(selectedNode.props.style, null, 4));

        dragPageAction.render();
    }

    return (
        <Pane
            fitHeight
            header={(
                <div styleName="header">
                    <div>当前选中: {currentName}</div>
                    <DesktopOutlined
                        styleName="tool"
                        onClick={() => setStyleEditorVisible(!styleEditorVisible)}
                    />
                </div>
            )}
        >
            <StyleEditor
                value={style}
                onChange={values => handleChange(values, true)}
                visible={styleEditorVisible}
                onCancel={() => setStyleEditorVisible(false)}
            />
            <Collapse
                style={{ border: 'none' }}
                defaultActiveKey={['layout',/*  'text', */ 'position', 'background', 'border']}
            >
                <Panel header="布局" key="layout">
                    <Layout value={style} onChange={handleChange} />
                </Panel>
                <Panel header="文字" key="text">
                    <Font value={style} onChange={handleChange} />
                </Panel>
                <Panel header="定位" key="position">
                    <Position value={style} onChange={handleChange} />
                </Panel>

                <Panel header="背景" key="background">
                    <Background value={style} onChange={handleChange} />
                </Panel>
                <Panel header="边框" key="border">
                    边框
                </Panel>
            </Collapse>
        </Pane>
    );
});
