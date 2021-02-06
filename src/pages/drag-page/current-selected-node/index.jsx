import React from 'react';
import config from 'src/commons/config-hoc';

export default config({
    connect: state => {
        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function(props) {
    let {
        selectedNode = {},
    } = props;

    // 有 null 的情况
    if (!selectedNode) selectedNode = {};

    const {
        __config = {},
        componentName,
    } = selectedNode;
    const {
        componentDisplayName,
    } = __config;

    let currentName = componentDisplayName || componentName;
    if (typeof currentName === 'function') currentName = currentName({node: selectedNode});

    return <div>当前选中: {currentName}</div>;
});
