import React, {useEffect, useRef} from 'react';
import {Form, ConfigProvider, Row, Col, Tooltip} from 'antd';
import Pane from '../../pane';
import elementMap from '../form-element';
import CurrentSelectedNode from '../../current-selected-node';
import {getComponentConfig, showFieldByAppend} from 'src/pages/drag-page/component-config';
import {getLabelWidth} from 'src/pages/drag-page/util';
import {DesktopOutlined} from '@ant-design/icons';
import MultipleElement from '../multiple-element';
import './style.less';

export default function PropsFormEditor(props) {
    const {
        refreshProps,
        selectedNode,
        dragPageAction,
        onChange,
        onEdit,
        fitHeight,
        tip,
        tool,
    } = props;

    const [form] = Form.useForm();
    const rootRef = useRef(null);

    const wrapperCol = {flex: '1 1 0%'};

    // 表单回显
    useEffect(() => {
        form.resetFields();

        const {componentName, props: nodeProps = {}} = selectedNode || {};
        const componentConfig = getComponentConfig(componentName);

        const {fields = []} = componentConfig || {};

        // 回显表单 设置默认值
        const fieldValues = {...nodeProps};

        // 设置默认属性
        fields.forEach(item => {
            const {field, defaultValue} = item;
            if (fieldValues[field] === undefined) {
                fieldValues[field] = defaultValue;
            }
        });

        // 设置表单
        form.setFieldsValue(fieldValues);

    }, [refreshProps, selectedNode]);

    const {fields: propFields = []} = getComponentConfig(selectedNode?.componentName);

    // 最大字符标签
    let maxLabel = '';
    propFields.forEach(item => {
        const {label} = item;
        if (label.length > maxLabel.length) maxLabel = label;
    });
    // 设置label宽度
    const labelWidth = getLabelWidth(maxLabel);
    const labelCol = {flex: `${labelWidth}px`};

    // 获取分类字段
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

    // 渲染分类字段
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
                                const FormElement = elementMap.button({...it, node: selectedNode});

                                return (
                                    <Form.Item
                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                        name={field}
                                        colon={false}
                                        noStyle
                                    >
                                        <FormElement/>
                                    </Form.Item>
                                );
                            })}
                        </div>
                    </div>
                </Col>
            );
        });
    }

    // 渲染字段
    function renderField(item) {
        const {
            label,
            desc,
            title: tip,
            field,
            appendField,
            type,
            span = 24,
            onKeyDown,
        } = item;
        const title = tip || desc || label;


        let FormElement = () => <span style={{color: 'red'}}>TODO {type} 对应的表单元素不存在</span>;

        if (Array.isArray(type)) {
            FormElement = MultipleElement;
        } else {
            const getElement = elementMap[type];

            if (getElement) {
                FormElement = getElement({...item, node: selectedNode});
            }
        }

        const labelEle = (
            <Tooltip placement="topRight" title={title} mouseLeaveDelay={0}>
                {label}
            </Tooltip>
        );

        function handleKeyDown(e) {
            onKeyDown && onKeyDown(e, {
                node: selectedNode,
                dragPageAction,
            });
        }

        const element = (
            <Col span={span}>
                <Form.Item
                    labelCol={labelCol}
                    wrapperCol={wrapperCol}
                    label={labelEle}
                    name={field}
                    colon={false}
                >
                    <FormElement onKeyDown={handleKeyDown} fieldOption={item} node={selectedNode}/>
                </Form.Item>
            </Col>
        );
        if (appendField) {
            return (
                <Form.Item shouldUpdate noStyle>
                    {({getFieldsValue}) => {
                        let isShow = showFieldByAppend(getFieldsValue(), appendField);

                        if (isShow) {
                            return element;
                        }

                        if (!selectedNode) return null;

                        if (!selectedNode.props) selectedNode.props = {};

                        if (selectedNode.props[field] !== undefined) {

                            Reflect.deleteProperty(selectedNode.props, field);

                            form.setFieldsValue({[field]: undefined});

                            dragPageAction.render();
                        }

                        return null;
                    }}
                </Form.Item>
            );
        }
        return element;
    }

    return (
        <Pane
            fitHeight={fitHeight}
            header={(
                <div styleName="header">
                    <CurrentSelectedNode tip={tip} node={selectedNode}/>
                    <div>
                        {tool}
                        <DesktopOutlined
                            disabled={!selectedNode}
                            styleName="tool"
                            onClick={() => onEdit()}
                        />
                    </div>
                </div>
            )}
        >
            <div styleName="root" ref={rootRef}>
                <ConfigProvider autoInsertSpaceInButton={false} getPopupContainer={() => rootRef.current}>
                    <Form
                        form={form}
                        onValuesChange={onChange}
                        name={selectedNode?.componentName || 'props'}
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
}
