import React, {useEffect, useState} from 'react';
import {Form} from 'antd';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import propsMap from '../base-components/props';
import elementMap from './form-element';
import CurrentSelectedNode from '../current-selected-node';
import './style.less';
import {v4 as uuid} from 'uuid';

const layout = {
    labelCol: {flex: '100px'},
    wrapperCol: {flex: 1},
};

export default config({
    connect: state => {

        return {
            selectedNode: state.dragPage.selectedNode,
        };
    },
})(function ComponentProps(props) {
    const {
        selectedNode,
        action: {dragPage: dragPageAction},
    } = props;

    const [propFields, setPropFields] = useState([]);
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {

        console.log('props', JSON.stringify(allValues, null, 4));

        if (!selectedNode?.componentName) return;

        if (!selectedNode?.props) selectedNode.props = {};

        selectedNode.props = {
            ...selectedNode.props,
            ...allValues,
            key: uuid(),
        };

        dragPageAction.render();
    }

    useEffect(() => {
        form.resetFields();

        if (!selectedNode) return setPropFields([]);

        const {componentName} = selectedNode;
        const propFields = propsMap[componentName];

        setPropFields(propFields || []);

        const fieldsValue = selectedNode.props || {};

        form.setFieldsValue(fieldsValue);

    }, [selectedNode]);
    return (
        <Pane
            fitHeight
            header={(
                <div>
                    <CurrentSelectedNode/>
                </div>
            )}
        >
            <div styleName="root">
                <Form
                    form={form}
                    onValuesChange={handleChange}
                    name="props"
                >
                    {propFields.map(item => {
                        const {label, field, type} = item;
                        let Element = elementMap[type](item);
                        if (!Element) {
                            Element = () => <span style={{color: 'red'}}>TODO ${type} 对应的表单元素不存在</span>;
                        }
                        return (
                            <Form.Item
                                {...layout}
                                label={label}
                                name={field}
                                colon={false}
                            >
                                <Element/>
                            </Form.Item>
                        );
                    })}
                </Form>
            </div>
        </Pane>
    );
});
