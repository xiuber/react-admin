import React, {useEffect, useState} from 'react';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import propsMap from '../base-components/props';
import './style.less';

export default config({
    connect: state => {

        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function ComponentProps(props) {
    const {
        selectedNode,
    } = props;
    const [propFields, setPropFields] = useState([]);
    useEffect(() => {
        if (!selectedNode) return setPropFields([]);

        const {componentName} = selectedNode;
        const propFields = propsMap[componentName];

        setPropFields(propFields);
    }, [selectedNode]);

    console.log(propFields);
    return (
        <Pane
            fitHeight
            header={(
                <div>
                    当前选中
                </div>
            )}
        >
            {JSON.stringify(propFields, null, 4)}
        </Pane>
    );
});
