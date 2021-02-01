import React, {useRef, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {Button} from 'antd';
import MonacoEditor from 'react-monaco-editor';
import './style.less';
import {
    DesktopOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
} from '@ant-design/icons';
import Pane from 'src/pages/drag-page/pane';
import {useHeight} from 'ra-lib';
import {isMac} from '../util';

function CodeEditor(props) {
    const {
        title,
        value,
        onChange = () => undefined,
        onSave = () => undefined,
        onClose = () => undefined,
    } = props;

    const mainRef = useRef(null);
    const monacoRef = useRef(null);
    const editorRef = useRef(null);
    const checkRef = useRef(0);
    const [height] = useHeight(mainRef, 53);
    const [errors, setErrors] = useState([]);
    const [code, setCode] = useState('');
    const [fullScreen, setFullScreen] = useState(false);

    useEffect(() => {
        setCode(value);
    }, [value]);

    useEffect(() => {
        const monaco = monacoRef.current;
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
            onSave(code);
        });
        editorRef.current.addCommand(monaco.KeyCode.Escape, function() {
            handleClose();
        });
    }, [code, monacoRef.current, fullScreen]);

    function handleFormat() {
        editorRef.current.getAction(['editor.action.formatDocument'])._run();
    }

    function handleClose() {
        if (fullScreen) return handleFullScreen();

        onClose();
    }

    function handleChange(code) {
        setCode(code);
        onChange(code);

        clearTimeout(checkRef.current);
        checkRef.current = setTimeout(() => {
            const errors = monacoRef.current.editor.getModelMarkers();
            setErrors(errors);
        }, 1000);
    }

    function editorDidMount(editor, monaco) {
        monacoRef.current = monaco;
        editorRef.current = editor;
        editor.focus();
    }

    function handleFullScreen() {
        const nextFullScreen = !fullScreen;

        setFullScreen(nextFullScreen);

        setTimeout(() => window.dispatchEvent(new Event('resize')));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }

    const options = {
        selectOnLineNumbers: true,
    };

    return (
        <div styleName={fullScreen ? 'fullScreen' : ''}>
            <Pane
                header={
                    <div styleName="header">
                        <div>
                            <DesktopOutlined style={{marginRight: 4}}/> {title}
                        </div>
                        <div styleName="tool">
                            <span onClick={handleFullScreen}>
                                {fullScreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
                            </span>
                        </div>
                    </div>
                }
            >
                <div styleName="root" ref={mainRef}>
                    <main>
                        <MonacoEditor
                            width="100%"
                            height={height}
                            language="javascript"
                            theme="vs-dark"
                            value={code}
                            options={options}
                            onChange={handleChange}
                            editorDidMount={editorDidMount}
                        />
                    </main>
                    <footer>
                        <Button
                            style={{marginRight: 8}}
                            onClick={handleFormat}
                        >
                            格式化
                        </Button>
                        {errors?.length ? (
                            <Button
                                type="danger"
                            >
                                有语法错误
                            </Button>
                        ) : (
                            <Button
                                className="codeEditorSave"
                                type="primary"
                                onClick={() => onSave(code)}
                            >
                                保存({isMac ? '⌘' : 'ctrl'}+s)
                            </Button>
                        )}

                        <Button
                            className="codeEditorClose"
                            onClick={handleClose}
                            style={{marginLeft: 8}}
                        >
                            {fullScreen ? '退出全屏' : '关闭'} (Esc)
                        </Button>
                    </footer>
                </div>
            </Pane>
        </div>
    );
}

CodeEditor.propTypes = {
    title: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
};

export default CodeEditor;
