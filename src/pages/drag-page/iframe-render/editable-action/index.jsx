import {useEffect} from 'react';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {debounce} from 'lodash';

export default function EditableAction(props) {
    const {
        pageConfig,
        iframeDocument,
        dragPageAction,
    } = props;

    const loop = (node, cb) => {
        const componentId = node.id;
        const className = `id_${componentId}`;
        const nodeConfig = getComponentConfig(node.componentName);
        const {editableContents} = nodeConfig;
        if (editableContents?.length) {
            editableContents.forEach(item => {
                let {selector} = item;

                let eles;
                if (selector) {
                    eles = iframeDocument.querySelectorAll(`.${className} ${selector}`);
                } else {
                    eles = iframeDocument.querySelectorAll(`.${className}`);
                }

                if (!eles?.length) return;
                eles.forEach((ele, index) => cb(ele, index, node, item));
            });
        }

        if (node.children?.length) {
            node.children.forEach(item => loop(item, cb));
        }
    };

    useEffect(() => {
        if (!iframeDocument) return;

        let tabIndex = 1000;
        loop(pageConfig, (ele, index, node, item) => {
            let {onInput, onBlur, propsField} = item;
            tabIndex++;

            let handleInput = () => undefined;

            if (propsField) {
                handleInput = (e) => {
                    if (!node.props) node.props = {};
                    node.props[propsField] = e.target.innerText;
                };
            }

            // 只能输入纯文本
            // ele.style.webkitUserModify = 'read-write-plaintext-only';

            ele.setAttribute('contenteditable', 'plaintext-only');
            ele.setAttribute('tabindex', tabIndex);
            // 清除 元素 focus 样式
            const prevOutline = window.getComputedStyle(ele).outline;
            const prevStyleOutline = ele.style.outline;

            ele.onfocus = () => {
                ele.style.outline = prevOutline;
                // setTimeout(() => {
                //     document.execCommand('selectAll', false, null);
                // }, 100);
            };


            ele.oninput = debounce(e => {
                if (onInput) {
                    onInput(e)({index, node, pageConfig, dragPageAction, iframeDocument});
                } else {
                    handleInput(e);
                }

                // 弹框内容编辑会光标跳动
                dragPageAction.refreshProps();

                // 都会导致焦点跳动
                // dragPageAction.render();
            }, 300);
            ele.onblur = e => {
                ele.style.outline = prevStyleOutline;
                if (onBlur) {
                    onBlur(e)({index, node, pageConfig, dragPageAction, iframeDocument});
                }
                dragPageAction.render();
            };
        });

        return () => {
            loop(pageConfig, (ele) => {
                // ele.style.userModify = '';
                ele.setAttribute('contenteditable', 'false');
                ele.removeAttribute('tabindex');
                ele.oninput = null;
                ele.onblur = null;
            });
        };
    }, [
        pageConfig,
        iframeDocument,
    ]);

    return null;
}
