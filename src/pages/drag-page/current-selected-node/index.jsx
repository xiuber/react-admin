import React from 'react';
import config from 'src/commons/config-hoc';
import {getComponentDisplayName} from 'src/pages/drag-page/base-components';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function(props) {
    const {selectedNode} = props;

    const name = getComponentDisplayName(selectedNode, true);

    return <div>当前选中: {name}</div>;
});
