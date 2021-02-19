import React from 'react';
import Pane from '../../pane';
import CurrentSelectedNode from '../../current-selected-node';
import {getComponentConfig} from 'src/pages/drag-page/component-config';
import {DesktopOutlined} from '@ant-design/icons';
import ObjectElement from '../object-element';
import './style.less';

export default function PropsFormEditor(props) {
    const {
        selectedNode,
        onChange,

        onEdit,
        fitHeight,
        tip,
        tool,
    } = props;

    const {fields} = getComponentConfig(selectedNode?.componentName);
    const value = selectedNode?.props || {};

    return (
        <Pane
            fitHeight={fitHeight}
            header={(
                <div styleName="header">
                    <CurrentSelectedNode tip={tip} node={selectedNode}/>
                    <div>
                        {tool}
                        <DesktopOutlined
                            disabled={!selectedNode}
                            styleName="tool"
                            onClick={() => onEdit()}
                        />
                    </div>
                </div>
            )}
        >
            <div styleName="root">
                <ObjectElement
                    selectedNode={selectedNode}
                    fields={fields}
                    value={value}
                    onChange={onChange}
                />
            </div>
        </Pane>
    );
}
