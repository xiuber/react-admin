import React from 'react';
import config from 'src/commons/config-hoc';
import {v4 as uuid} from 'uuid';

export default config({})(function Left(props) {
    return (
        <div
            style={{width: 100, height: 100, background: 'red'}}
            draggable
            onDragStart={
                function(e) {
                    e.stopPropagation();
                    const componentId = uuid();
                    const config = {
                        __config: {
                            componentId,
                            isContainer: true,
                        },
                        componentName: 'div',
                        style: {height: 50, background: 'green', border: '1px solid #fff', padding: 16},
                        children: [componentId],
                    };
                    e.dataTransfer.setData('componentConfig', JSON.stringify(config));
                }
            }
        >
            啥的呢
        </div>
    );
});
