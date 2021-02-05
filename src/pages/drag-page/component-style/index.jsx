import React, {useState, useEffect} from 'react';
import {Collapse} from 'antd';
import {DesktopOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import Layout from './layout';
import Font from './font';
import Position from './position';
import Background from './background';
import Border from './border';
import StyleEditor from './style-editor';
import {v4 as uuid} from 'uuid';
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
    const [, setRender] = useState('');

    function handleChange(values, replace) {
        if (!selectedNode?.componentName) return;

        if (!selectedNode?.props) selectedNode.props = {};

        if (!selectedNode.props.style) selectedNode.props.style = {};

        const style = selectedNode.props.style;

        if (replace) {
            // 直接替换，一般来自源码编辑器
            selectedNode.props.style = values;
            // 触发当前组件重新渲染 让编辑器拿到最新的style
            setRender(uuid());
        } else {
            // 合并
            selectedNode.props.style = {
                ...style,
                ...values,
            };
        }

        // 设置 key 每次保证渲染，都重新创建节点，否则属性无法被清空，样式为空，或者不合法，将不能覆盖已有样式
        // prefStyle: {backgroundColor: 'red'} nextStyle: {backgroundColor: 'red111'}, 样式依旧为红色
        selectedNode.props.key = uuid();

        console.log('selectedNode style', JSON.stringify(selectedNode.props.style, null, 4));

        dragPageAction.render();
    }

    useEffect(() => {
        dragPageAction.setRightSideWidth(styleEditorVisible ? 440 : 385);
    }, [styleEditorVisible]);

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
                style={{border: 'none'}}
                defaultActiveKey={[
                    // 'layout',
                    // 'text',
                    // 'position',
                    // 'background',
                    'border',
                ]}
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
                    <Border value={style} onChange={handleChange}/>
                </Panel>
            </Collapse>
        </Pane>
    );
});
