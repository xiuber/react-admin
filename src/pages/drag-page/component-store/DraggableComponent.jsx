import React from 'react';
import config from 'src/commons/config-hoc';
import './DraggableComponent.less';
import NodeRender from '../iframe-render/node-render/NodeRender';
import { cloneDeep } from 'lodash';
import Draggable from './Draggable';

export default config({})(function DraggableComponent(props) {
    const { data } = props;

    function _renderPreview() {
        const { renderPreview, previewZoom, previewStyle, previewWrapperStyle, config } = data;

        if (!renderPreview) return null;

        const componentConfig = cloneDeep(config);
        if (previewStyle) {
            if (!componentConfig.props) componentConfig.props = {};
            if (!componentConfig.props.style) componentConfig.props.style = {};

            componentConfig.props.style = {
                ...componentConfig.props.style,
                ...previewStyle,
            };
        }

        let preview = renderPreview === true ? (
            <NodeRender config={componentConfig}/>
        ) : renderPreview;

        if (typeof preview === 'function') {
            preview = preview(config);
        }

        return (
            <div styleName="preview" style={previewWrapperStyle}>
                {previewZoom ? (
                    <div styleName="previewZoom" style={{ zoom: previewZoom || 1 }}>
                        {preview}
                    </div>
                ) : preview}
            </div>
        );
    }

    return (
        <Draggable data={data}>
            <div styleName="root">
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
                {_renderPreview()}
            </div>
        </Draggable>
    );
});

