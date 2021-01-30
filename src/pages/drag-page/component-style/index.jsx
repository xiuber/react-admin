import React from 'react';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import './style.less';


export default config({})(function ComponentStyle(props) {
    return (
        <Pane
            header={(
                <div>
                    当前选中
                </div>
            )}
        >
            <div style={{height: 1000, background: 'red'}}/>
        </Pane>
    );
});
