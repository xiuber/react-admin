import React from 'react';
import config from 'src/commons/config-hoc';
import { v4 as uuid } from 'uuid';
import './DraggableComponent.less';
import Element from '../iframe-render/Element';
import {setComponentDefaultOptions} from '../base-components'

export default config({
    connect: state => {
        return {
            categories: state.componentStore.categories,
            category: state.componentStore.category,
        };
    },
})(function DraggableComponent(props) {
    const {
        data,
        action: {
            dragPage: dragPageAction,
        },
    } = props;

    function handleDragStart(e) {
        e.stopPropagation();

        // 打开组件组
        setTimeout(() => {
            dragPageAction.setActiveSideKey('componentTree');
        });
        const { config } = data;

        // 设置 componentId
        const loop = (node) => {
            if (!node.__config) node.__config = {};

            node.__config.componentId = uuid();

            if (node.children?.length) {
                node.children.forEach(n => loop(n));
            }
        };

        loop(config);

        e.dataTransfer.setData('componentConfig', JSON.stringify(config));
        dragPageAction.setDraggingNode(config);
    }

    function handleDragEnd() {
        // 从新打开组件库
        dragPageAction.setActiveSideKey('componentStore');
    }

    return (
        <div
            styleName="root"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div styleName="title">
                {data.icon} {data.title}
            </div>
            {data.image ? (
                <img
                    draggable={false}
                    styleName="img"
                    src={data.image}
                    alt="组件预览图"
                />
            ) : null}
            {data.renderPreview ? (
                <div styleName="preview">
                    <Element
                        config={data.renderPreview === true ? data.config : setComponentDefaultOptions(data.renderPreview)}
                        activeToolKey="preview"
                    />
                </div>
            ) : null}
        </div>
    );
});

