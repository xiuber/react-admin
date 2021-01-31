import React from 'react';
import config from 'src/commons/config-hoc';
import './style.less';
import CodeEditor from 'src/pages/drag-page/code-editor';
import JSON5 from 'json5';

export default config({
    connect: state => {
        return {
            pageConfig: state.dragPage.pageConfig,
        };
    },
})(function SchemaEditor(props) {
    const {pageConfig} = props;

    const code = `export default ${JSON5.stringify(pageConfig, null, 4)}`
    return (
        <div styleName="root">
            <CodeEditor
                title="Schema 源码开发"
                value={code}
                onSave={value => console.log(value)}
            />
        </div>
    );
});
