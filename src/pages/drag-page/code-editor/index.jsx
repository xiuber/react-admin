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
import prettier from 'prettier/standalone';
import parserPostCss from 'prettier/parser-postcss';
import {isMac} from '../util';

function CodeEditor(props) {
    const {
        title,
        value,
        language,
        onChange = () => undefined,
        onSave,
        onClose = () => undefined,
    } = props;

    const mainRef = useRef(null);
    const monacoRef = useRef(null);
    const editorRef = useRef(null);
    const [height] = useHeight(mainRef, 53);
    const [errors, setErrors] = useState([]);
    const [code, setCode] = useState('');
    const [fullScreen, setFullScreen] = useState(false);

    function handleSave(code) {

        onSave && onSave(code, errors);
    }

    useEffect(() => {
        if (value instanceof Promise) {
            value.then(code => {
                if (language === 'css') {
                    const formattedCss = prettier.format(code, {parser: 'css', plugins: [parserPostCss]});
                    setCode(formattedCss);
                    return;
                }
                setCode(code);
            });
        } else {
            setCode(value);
        }
    }, [value]);

    useEffect(() => {
        const monaco = monacoRef.current;
        editorRef.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function() {
            handleSave(code);
        });
        editorRef.current.addCommand(monaco.KeyCode.Escape, function() {
            handleClose();
        });

    }, [code, errors, monacoRef.current, fullScreen]);

    function handleFormat() {
        if (language === 'css') {
            const formattedCss = prettier.format(code, {parser: 'css', plugins: [parserPostCss]});
            setCode(formattedCss);
            return;
        }
        editorRef.current.getAction(['editor.action.formatDocument'])._run();
    }

    function handleClose() {
        if (fullScreen) return handleFullScreen();

        onClose();
    }

    function handleChange(code) {
        setCode(code);
        onChange(code, errors);
    }


    // 检测错误
    useEffect(() => {
        const si = setInterval(() => {
            const errors = monacoRef.current.editor.getModelMarkers();
            setErrors(errors);
        }, 100);
        const st = setTimeout(() => {
            clearInterval(si);
        }, 3000);

        return () => {
            clearInterval(si);
            clearTimeout(st);
        };
    }, [code]);

    function editorDidMount(editor, monaco) {
        monacoRef.current = monaco;
        editorRef.current = editor;
        editor.focus();

        // 取消选中，打开Editor 时，内容会被全部选中
        setTimeout(() => {
            editor.setSelection(new monaco.Selection(0, 0, 0, 0));
        });
    }

    function handleFullScreen() {
        const nextFullScreen = !fullScreen;

        setFullScreen(nextFullScreen);

        setTimeout(() => window.dispatchEvent(new Event('resize')));
        setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
    }

    // https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditorconstructionoptions.html
    const options = {
        selectOnLineNumbers: true,
        tabSize: 2,
        minimap: {
            enabled: fullScreen,
        },
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
                            language={language}
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
                        {onSave ? (
                            errors?.length ? (
                                <Button
                                    style={{marginRight: 8}}
                                    type="danger"
                                >
                                    有语法错误
                                </Button>
                            ) : (
                                <Button
                                    style={{marginRight: 8}}
                                    className="codeEditorSave"
                                    type="primary"
                                    onClick={() => handleSave(code)}
                                >
                                    保存({isMac ? '⌘' : 'ctrl'}+s)
                                </Button>
                            )
                        ) : null}
                        <Button
                            className="codeEditorClose"
                            onClick={handleClose}
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
    language: PropTypes.string,
    title: PropTypes.any,
    value: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
    onClose: PropTypes.func,
};

CodeEditor.defaultProps = {
    language: 'javascript',
};

export default CodeEditor;
