import React, {useEffect, useState} from 'react';
import {message, Switch} from 'antd';
import JSON5 from 'json5';
import config from 'src/commons/config-hoc';
import CodeEditor from 'src/pages/drag-page/code-editor';
import {findNodeById, usePrevious} from '../util';
import {removeComponentConfig, setComponentDefaultOptions} from '../base-components';
import DragBar from '../drag-bar';
import './style.less';

const EDIT_TYPE = {
    CURRENT_NODE: 'CURRENT_NODE',
    ALL: 'ALL',
};

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            selectedNode: state.dragPage.selectedNode,
            activeSideKey: state.dragPage.activeSideKey,
            schemaEditorWidth: state.dragPage.schemaEditorWidth,
        };
    },
})(function SchemaEditor(props) {
    const {
        pageConfig,
        selectedNode,
        activeSideKey,
        schemaEditorWidth,
        action: {dragPage: dragPageAction},
    } = props;

    const [visible, setVisible] = useState(false);
    const [editType, setEditType] = useState(EDIT_TYPE.CURRENT_NODE);
    const [code, setCode] = useState('');

    const prevActiveSideKey = usePrevious(activeSideKey);
    useEffect(() => {
        const key = 'schemaEditor';
        const visible = (!prevActiveSideKey && activeSideKey === key)
            || (prevActiveSideKey !== key && activeSideKey === key);

        setVisible(visible);
    }, [activeSideKey]);

    function handleSave(value, errors) {
        if (errors?.length) return message.error('语法错误，请修改后保存！');
        let nodeConfig = null;
        if (value) {
            const val = value.replace('export', '').replace('default', '');
            try {
                nodeConfig = JSON5.parse(val);

                if (typeof nodeConfig !== 'object' || Array.isArray(nodeConfig)) {
                    return message.error('语法错误，请修改后保存！');
                }

                setComponentDefaultOptions(nodeConfig);
            } catch (e) {
                console.error(e);
                return message.error('语法错误，请修改后保存！');
            }
        }

        let result;
        if (editType !== EDIT_TYPE.ALL) {
            // 对应到pageConfig 中
            const componentId = nodeConfig?.__config?.componentId;
            const node = findNodeById(pageConfig, componentId);

            if (!node) return message.error('节点无法对应，您是否修改了根节点的__id?');

            // 删除所有数据，保留引用
            Object.keys(node).forEach(key => {
                Reflect.deleteProperty(node, key);
            });
            // 赋值
            Object.entries(nodeConfig).forEach(([key, value]) => {
                node[key] = value;
            });
            result = pageConfig;
        } else {
            result = nodeConfig;
        }

        dragPageAction.setPageConfig({...result});

        // 原选中id是否存在
        if (!findNodeById(result, selectedNode?.__config?.componentId)) {
            dragPageAction.setSelectedNodeId(null);
        }

        message.success('保存成功！');
    }

    function handleClose() {
        dragPageAction.setActiveSideKey(null);
    }

    function handleDragging(info) {
        const {clientX} = info;

        dragPageAction.setSchemaEditorWidth(clientX - 56);
    }

    useEffect(() => {
        let editNode;
        if (editType === EDIT_TYPE.CURRENT_NODE) editNode = selectedNode || {};
        if (editType === EDIT_TYPE.ALL) editNode = pageConfig || {};

        const code = `export default ${JSON5.stringify(removeComponentConfig(editNode, true), null, 2)}`;

        setCode(code);
    }, [editType, selectedNode, pageConfig]);

    if (!visible) return null;

    return (
        <div styleName="root" id="schemaEditor" style={{width: schemaEditorWidth}}>
            <DragBar onDragging={handleDragging}/>
            <CodeEditor
                editorWidth={schemaEditorWidth}
                title={(
                    <div styleName="title">
                        <span style={{marginRight: 8}}>Schema 源码开发</span>
                        <Switch
                            checkedChildren="选中"
                            unCheckedChildren="全部"
                            checked={editType === EDIT_TYPE.CURRENT_NODE}
                            onChange={checked => setEditType(checked ? EDIT_TYPE.CURRENT_NODE : EDIT_TYPE.ALL)}
                        />
                    </div>
                )}
                value={code}
                onSave={handleSave}
                onClose={handleClose}
            />
        </div>
    );
});
