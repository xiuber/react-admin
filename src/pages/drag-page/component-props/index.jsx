import React, {useEffect, useState, useRef} from 'react';
import {Form, ConfigProvider} from 'antd';
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
    const rootRef = useRef(null);

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

    const categories = [];

    propFields.forEach(item => {
        const {category, categoryOrder} = item;
        if (!category) return;

        let node = categories.find(it => it.category === category);
        if (!node) {
            node = {category, fields: []};
            categories.push(node);
        }

        if (categoryOrder && !node.categoryOrder) node.categoryOrder = categoryOrder;

        node.fields.push(item);
    });

    function renderCategory(index) {
        const _categories = categories.filter(item => {
            const {categoryOrder = 0} = item;

            return categoryOrder === index;

        });
        return _categories.map(item => {
            const {category, fields} = item;
            return (
                <div styleName="category">
                    <div styleName="label" style={{flex: `0 0 ${layout.labelCol.flex}`}}>
                        {category}
                    </div>
                    <div styleName="wrapper">
                        {fields.map(it => {
                            const {field} = it;
                            const Element = elementMap.button(it);

                            return (
                                <Form.Item
                                    {...layout}
                                    name={field}
                                    colon={false}
                                    noStyle
                                >
                                    <Element getPopupContainer={() => rootRef.current}/>
                                </Form.Item>
                            );
                        })}
                    </div>
                </div>
            );
        });
    }

    function renderField(item) {
        const {label, field, type} = item;
        const getElement = elementMap[type];

        let Element = () => <span style={{color: 'red'}}>TODO {type} 对应的表单元素不存在</span>;

        if (getElement) {
            Element = elementMap[type](item);
        }

        return (
            <Form.Item
                {...layout}
                label={label}
                name={field}
                colon={false}
            >
                <Element getPopupContainer={() => rootRef.current}/>
            </Form.Item>
        );
    }

    return (
        <Pane
            fitHeight
            header={(
                <div>
                    <CurrentSelectedNode/>
                </div>
            )}
        >
            <div styleName="root" ref={rootRef}>
                <ConfigProvider autoInsertSpaceInButton={false}>
                    <Form
                        form={form}
                        onValuesChange={handleChange}
                        name="props"
                    >
                        {propFields.filter(item => !item.category)
                            .map((item, index) => {
                                let category = renderCategory(index);
                                const field = renderField(item);

                                return [category, field];
                            })}
                    </Form>
                </ConfigProvider>
            </div>
        </Pane>
    );
});
