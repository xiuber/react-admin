import {useEffect} from 'react';
import config from 'src/commons/config-hoc';
import {v4 as uuid} from 'uuid';
import {copyTextToClipboard, getTextFromClipboard} from './util';

/**
 ### 快捷键说明
 ## 通用
 1. meta(ctrl) + s 保存
 1. esc 关闭 视图

 ## 设计视图
 1. meta(ctrl) + c  meta(ctrl) + v 复制粘贴选中节点
 1. meta(ctrl) + d 删除选中节点

 ## 上下左右类型输入
 1. meta(ctr) + 回车（鼠标点击） 同步上下 或 左右
 1. shift + meta(ctr) + 回车（鼠标点击） 同步所有

 * */

export default config({
    connect: state => {
        return {
            selectedNodeId: state.dragPage.selectedNodeId,
            selectedNode: state.dragPage.selectedNode,
            activeSideKey: state.dragPage.activeSideKey,
            showSide: state.dragPage.showSide,
        };
    },
})(function KeyMap(props) {
    const {
        iframe,
        selectedNode,
        selectedNodeId,
        activeSideKey,
        showSide,
        action: {dragPage: dragPageAction},
    } = props;

    const isSchemaEditor = showSide && activeSideKey === 'schemaEditor';
    const isDesignPage = !isSchemaEditor;

    // 触发元素的click事件
    function triggerClick(selector) {
        const ele = document.querySelector(selector);

        if (!ele) return;

        ele.click();
    }

    function handleCtrlOrCommandS(e) {
        e.preventDefault();
        //  Schema 源码编辑器保存事件
        if (isSchemaEditor) return triggerClick('#schemaEditor .codeEditorSave');

        // 编辑页面保存事件
        if (isDesignPage) return dragPageAction.save();

    }

    function handleEscape(e) {
        e.preventDefault();

        // Schema 源码编辑器关闭事件
        if (isSchemaEditor) return triggerClick('#schemaEditor .codeEditorClose');
    }

    function handleCtrlOrCommandC(e) {
        // 如果当前不是编辑页面，直接返回
        if (!isDesignPage) return;

        const selection = window.getSelection();
        const selectionText = selection + '';

        // 用户有选中内容
        if (selectionText) return;

        if (!selectedNode) return;

        // 将当前选中节点，保存到剪切板中
        const nodeText = JSON.stringify(selectedNode);
        copyTextToClipboard(nodeText);
    }

    async function handleCtrlOrCommandV(e) {
        // 如果当前不是编辑页面，直接返回
        if (!isDesignPage) return;

        if (!selectedNode) return;

        try {
            const text = await getTextFromClipboard();
            const cloneNode = JSON.parse(text);

            // 不是节点
            if (!cloneNode.componentName) return;

            const targetId = cloneNode.__config?.componentId;

            const loopId = (node) => {
                if (!node.__config) node.__config = {};
                node.__config.componentId = uuid();
                if (node.children?.length) {
                    node.children.forEach(item => loopId(item));
                }
            };

            loopId(cloneNode);

            const options = {
                node: cloneNode,
                targetId,
                isAfter: true,
            };

            dragPageAction.addNode(options);

        } catch (e) {

        }
    }


    async function handleKeyDown(e) {
        const {key, metaKey, ctrlKey} = e;
        const mc = metaKey || ctrlKey;

        if (mc && key === 'd') {
            if (!isDesignPage) return;
            e.preventDefault();
            dragPageAction.deleteNodeById(selectedNodeId);
        }
        if (mc && key === 's') handleCtrlOrCommandS(e);
        if (mc && key === 'c') handleCtrlOrCommandC(e);
        if (mc && key === 'v') await handleCtrlOrCommandV(e);

        if (key === 'Escape') handleEscape(e);
    }

    useEffect(() => {
        if (iframe) {
            const iframeDocument = iframe.contentDocument;
            iframeDocument.addEventListener('keydown', handleKeyDown);
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            if (iframe) {
                const iframeDocument = iframe.contentDocument;
                iframeDocument.removeEventListener('keydown', handleKeyDown);
            }
        };
    });

    return null;
});
