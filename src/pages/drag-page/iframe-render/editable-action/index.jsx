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
                    if (typeof selector === 'function') {
                        eles = iframeDocument.querySelectorAll(selector({node, pageConfig}));
                    } else {
                        eles = iframeDocument.querySelectorAll(`.${className} ${selector}`);
                    }
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

        const actions = {};

        let tabIndex = 1000;
        loop(pageConfig, (ele, index, node, item) => {
            let {onInput, onBlur, onClick, propsField} = item;
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

            const options = {index, node, pageConfig, dragPageAction, iframeDocument};

            function handleClick(e) {
                onClick && onClick(e)(options);
            }

            function handleFocus(e) {
                ele.style.outline = prevOutline;
            }

            const handleInputDebounce = debounce(e => {
                if (onInput) {
                    onInput(e)(options);
                } else {
                    handleInput(e);
                }

                // 弹框内容编辑会光标跳动
                dragPageAction.refreshProps();

                // 都会导致焦点跳动
                // dragPageAction.render();
            }, 300);

            function handleBlur(e) {
                ele.style.outline = prevStyleOutline;
                if (onBlur) {
                    onBlur(e)(options);
                }
                dragPageAction.render();
            }

            const eventMap = {
                click: handleClick,
                focus: handleFocus,
                input: handleInputDebounce,
                blur: handleBlur,
            };

            Object.entries(eventMap)
                .forEach(([action, handler]) => {
                    ele.addEventListener(action, handler);
                });

            actions[node.id] = eventMap;
        });

        return () => {
            loop(pageConfig, (ele, index, node) => {
                // ele.style.userModify = '';
                ele.setAttribute('contenteditable', 'false');
                ele.removeAttribute('tabindex');
                const eventMap = actions[node.id];

                Object.entries(eventMap)
                    .forEach(([action, handler]) => {
                        ele.removeEventListener(action, handler);
                    });
            });
        };
    }, [
        pageConfig,
        iframeDocument,
    ]);

    return null;
}
