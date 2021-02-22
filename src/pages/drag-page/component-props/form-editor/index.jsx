import React from 'react';
import Pane from '../../pane';
import CurrentSelectedNode from '../../current-selected-node';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {DesktopOutlined} from '@ant-design/icons';
import ObjectElement from '../object-element';
import './style.less';

export default function PropsFormEditor(props) {
    const {
        node,
        onChange,

        onEdit,
        fitHeight,
        tip,
        tool,
    } = props;

    const {fields} = getComponentConfig(node?.componentName);
    const value = node?.props || {};

    return (
        <Pane
            fitHeight={fitHeight}
            header={(
                <div styleName="header">
                    <CurrentSelectedNode tip={tip} node={node}/>
                    <div>
                        {tool}
                        <DesktopOutlined
                            disabled={!node}
                            styleName="tool"
                            onClick={() => onEdit()}
                        />
                    </div>
                </div>
            )}
        >
            <div styleName="root">
                <ObjectElement
                    node={node}
                    fields={fields}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </Pane>
    );
}
