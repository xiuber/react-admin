import React, {useEffect, useState} from 'react';
import JSON5 from 'json5';
import config from 'src/commons/config-hoc';
import CodeEditor from 'src/pages/drag-page/code-editor';
import './style.less';
import {message} from 'antd';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
            activeSideKey: state.dragPage.activeSideKey,
        };
    },
})(function StyleEditor(props) {
    const {
        visible,
        value,
        onChange,
        onCancel,
    } = props;

    function handleChange(value) {
        let style = null;
        if (value) {
            const val = value.replace('export', '').replace('default', '');
            try {
                style = JSON5.parse(val);

                if (typeof style !== 'object' || Array.isArray(style)) {
                    return;
                }
                onChange && onChange(style);
            } catch (e) {
                return;
            }
        }
    }

    if (!visible) return null;


    const obj = Object.entries(value || {}).reduce((prev, curr) => {
        const [key, value] = curr;
        if (key.startsWith('__')) return prev;

        prev[key] = value;

        return prev;
    }, {});
    const code = `export default ${JSON5.stringify(obj, null, 4)}`;

    return (
        <div styleName="root">
            <CodeEditor
                title="Schema 源码开发"
                value={code}
                onChange={handleChange}
                onClose={onCancel}
            />
        </div>
    );
});
