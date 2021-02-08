import React, {useEffect, useState, useRef} from 'react';
import {Form, ConfigProvider, Row, Col} from 'antd';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import propsMap from '../base-components/props';
import elementMap from './form-element';
import CurrentSelectedNode from '../current-selected-node';
import './style.less';
import {v4 as uuid} from 'uuid';

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
    const [labelCol, setLabelCol] = useState({flex: '80px'});

    const wrapperCol = {flex: '1 1 0%'};

    function handleChange(changedValues, allValues) {


        if (!selectedNode?.componentName) return;

        if (!selectedNode?.props) selectedNode.props = {};

        selectedNode.props = {
            ...selectedNode.props,
            ...allValues,
            key: uuid(),
        };

        const options = selectedNode.props.options || [];

        options.forEach(item => {
            Reflect.deleteProperty(item, '_form');
        });

        console.log('props', JSON.stringify(selectedNode.props, null, 4));
        dragPageAction.render();
    }

    useEffect(() => {
        form.resetFields();

        const {componentName, props: nodeProps = {}} = selectedNode || {};
        const propFields = propsMap[componentName];

        const {fields = [], labelWidth} = propFields || {};

        setPropFields(fields);

        // 回显表单 设置默认值
        const fieldValues = {...nodeProps};
        fields.forEach(item => {
            const {field, defaultValue} = item;
            if (fieldValues[field] === undefined) {
                fieldValues[field] = defaultValue;
            }
        });

        form.setFieldsValue(fieldValues);

        // 设置label宽度
        if (labelWidth) {
            setLabelCol({flex: labelWidth});
        }

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
                <Col span={24}>
                    <div styleName="category">
                        <div styleName="label" style={{flex: `0 0 ${labelCol.flex}`}}>
                            {category}
                        </div>
                        <div styleName="wrapper">
                            {fields.map(it => {
                                const {field} = it;
                                const FormElement = elementMap.button(it);

                                return (
                                    <Form.Item
                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                        name={field}
                                        colon={false}
                                        noStyle
                                    >
                                        <FormElement getPopupContainer={() => rootRef.current}/>
                                    </Form.Item>
                                );
                            })}
                        </div>
                    </div>
                </Col>
            );
        });
    }

    function renderField(item) {
        const {label, labelWidth = labelCol.flex, field, type, span = 24} = item;
        const getElement = elementMap[type];

        let FormElement = () => <span style={{color: 'red'}}>TODO {type} 对应的表单元素不存在</span>;

        if (getElement) {
            FormElement = elementMap[type](item);
        }

        return (
            <Col span={span}>
                <Form.Item
                    labelCol={{flex: labelWidth}}
                    wrapperCol={wrapperCol}
                    label={label}
                    name={field}
                    colon={false}
                >
                    <FormElement getPopupContainer={() => rootRef.current}/>
                </Form.Item>
            </Col>
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
                        <Row>
                            {propFields.filter(item => !item.category)
                                .map((item, index) => {
                                    let category = renderCategory(index);
                                    const field = renderField(item);

                                    return [category, field];
                                })}
                        </Row>
                    </Form>
                </ConfigProvider>
            </div>
        </Pane>
    );
});
