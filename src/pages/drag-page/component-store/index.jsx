import React from 'react';
import {v4 as uuid} from 'uuid';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import './style.less';

export default config({
    connect: state => {
        return {};
    },
})(function ComponentStore(props) {
    const {
        action: {dragPage: dragPageAction},
    } = props;

    function handleDragStart(e) {
        e.stopPropagation();

        setTimeout(() => {
            dragPageAction.setActiveSideKey('componentTree');
        });
        const componentId = uuid();
        const config = {
            __config: {
                componentId,
                isContainer: true,
            },
            componentName: 'div',
            props: {
                style: {height: 50, background: 'grey', border: '1px solid #fff', padding: 16},
            },
            children: [
                {
                    __config: {
                        componentId: uuid(),
                    },
                    componentName: 'Text',
                    props: {
                        text: componentId,
                    },
                },
            ],
        };
        e.dataTransfer.setData('componentConfig', JSON.stringify(config));
        dragPageAction.setDraggingNode(config);
    }

    function handleDragEnd() {
        dragPageAction.setActiveSideKey('componentStore');
    }

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件
                </div>
            }
        >
            <div styleName="root">
                <div
                    style={{width: 100, height: 100, background: 'red'}}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    啥的呢
                </div>
            </div>
        </Pane>
    );
});
