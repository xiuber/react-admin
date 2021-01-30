import React from 'react';
import config from 'src/commons/config-hoc';
import {v4 as uuid} from 'uuid';

import './style.less';
import {PageContent} from 'ra-lib';
import {AppstoreOutlined} from '@ant-design/icons';

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
            style: {height: 50, background: 'grey', border: '1px solid #fff', padding: 16},
            children: [
                {
                    __config: {
                        componentId: uuid(),
                    },
                    componentName: 'Text',
                    text: componentId,
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
        <PageContent fitHeight otherHeight={8} styleName="root">
            <header>
                <span>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    组件
                </span>
            </header>
            <main>
                <div
                    style={{width: 100, height: 100, background: 'red'}}
                    draggable
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
                    啥的呢
                </div>
            </main>
        </PageContent>
    );
});
