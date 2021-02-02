import React from 'react';
import config from 'src/commons/config-hoc';
import './DraggableComponent.less';
import Element from '../iframe-render/Element';
import {cloneDeep} from 'lodash';
import Draggable from './Draggable';

export default config({})(function DraggableComponent(props) {
    const {data} = props;

    function renderPreview() {
        const {renderPreview, previewZoom, previewStyle, config} = data;

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

        return (
            <div styleName="preview">
                <div styleName="previewZoom" style={{zoom: previewZoom || 1}}>
                    {renderPreview === true ? (
                        <Element
                            config={componentConfig}
                            activeToolKey="preview"
                        />
                    ) : renderPreview}
                </div>
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
                {renderPreview()}
            </div>
        </Draggable>
    );
});

