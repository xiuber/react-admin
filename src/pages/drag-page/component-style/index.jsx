import React, {useState} from 'react';
import {Collapse} from 'antd';
import {DesktopOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import Layout from './layout';
import Font from './font';
import Position from './position';
import Background from './background';
import StyleEditor from './style-editor';
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
        action: {dragPage: dragPageAction},
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

    function handleChange(values) {
        if (!selectedNode?.componentName) return;

        // 去空
        const val = Object.entries(values).reduce((prev, curr) => {
            const [key, value] = curr;
            if (value !== '' && value !== undefined) prev[key] = value;

            return prev;
        }, {});

        if (!selectedNode?.props) selectedNode.props = {};

        if (!selectedNode.props.style) selectedNode.props.style = {};

        const style = selectedNode.props.style;

        selectedNode.props.style = {
            ...style,
            ...val,
        };


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
                onChange={handleChange}
                visible={styleEditorVisible}
                onCancel={() => setStyleEditorVisible(false)}
            />
            <Collapse
                style={{border: 'none'}}
                defaultActiveKey={['layout',/*  'text', */ 'position', 'background', 'border']}
            >
                <Panel header="布局" key="layout">
                    <Layout value={style} onChange={handleChange}/>
                </Panel>
                <Panel header="文字" key="text">
                    <Font value={style} onChange={handleChange}/>
                </Panel>
                <Panel header="定位" key="position">
                    <Position value={style} onChange={handleChange}/>
                </Panel>

                <Panel header="背景" key="background">
                    <Background value={style} onChange={handleChange}/>
                </Panel>
                <Panel header="边框" key="border">
                    边框
                </Panel>
            </Collapse>
        </Pane>
    );
});
