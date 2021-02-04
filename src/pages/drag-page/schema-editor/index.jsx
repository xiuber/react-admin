import React, {useEffect, useState} from 'react';
import {message} from 'antd';
import JSON5 from 'json5';
import config from 'src/commons/config-hoc';
import CodeEditor from 'src/pages/drag-page/code-editor';
import {usePrevious} from '../util';
import {removeComponentConfig, setComponentDefaultOptions} from '../base-components';
import './style.less';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function SchemaEditor(props) {
    const {
        pageConfig,
        activeSideKey,
        action: {dragPage: dragPageAction},
    } = props;

    const [visible, setVisible] = useState(false);

    const prevActiveSideKey = usePrevious(activeSideKey);
    useEffect(() => {
        const key = 'schemaEditor';
        const visible = (!prevActiveSideKey && activeSideKey === key)
            || (prevActiveSideKey !== key && activeSideKey === key);

        setVisible(visible);
    }, [activeSideKey]);

    function handleSave(value) {
        let pageConfig = null;
        if (value) {
            const val = value.replace('export', '').replace('default', '');
            try {
                pageConfig = JSON5.parse(val);

                if (typeof pageConfig !== 'object' || Array.isArray(pageConfig)) {
                    return message.error('格式错误');
                }

                setComponentDefaultOptions(pageConfig);
            } catch (e) {
                return message.error('格式错误');
            }
        }

        dragPageAction.setPageConfig(pageConfig);

        dragPageAction.setSelectedNodeId(null);
    }

    function handleClose() {
        dragPageAction.setActiveSideKey(null);
    }

    if (!visible) return null;

    const code = `export default ${JSON5.stringify(removeComponentConfig(pageConfig), null, 2)}`;
    return (
        <div styleName="root" id="schemaEditor">
            <CodeEditor
                title="Schema 源码开发"
                value={code}
                onSave={handleSave}
                onClose={handleClose}
            />
        </div>
    );
});
