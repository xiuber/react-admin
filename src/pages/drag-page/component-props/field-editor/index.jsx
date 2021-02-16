import React, {useEffect, useState, useRef} from 'react';
import {Form, ConfigProvider, Row, Col, Tooltip} from 'antd';
import Pane from '../../pane';
import elementMap from '../form-element';
import CurrentSelectedNode from '../../current-selected-node';
import {getComponentConfig, showFieldByAppend} from 'src/pages/drag-page/component-config';
import {DesktopOutlined} from '@ant-design/icons';
import PropsEditor from '../props-editor';
import './style.less';

function getLabelWidth(label) {
    if (!label?.length) return 0;

    // 统计汉字数，不包括标点符号
    const m = label.match(/[\u4e00-\u9fff\uf900-\ufaff]/g);
    const chineseCount = (!m ? 0 : m.length);
    const otherCount = label.length - chineseCount;
    return (chineseCount + otherCount / 2) * 12 + 30;
}

export default function ComponentProps(props) {
    const {
        rightSideWidth,
        selectedNode,
        refreshProps,
        dragPageAction,
        onChange,
        fitHeight,
        tip,
        tool,
    } = props;

    const [form] = Form.useForm();
    const rootRef = useRef(null);
    const containerRef = useRef(null);
    const [propFields, setPropFields] = useState([]);
    const [labelCol, setLabelCol] = useState({flex: '80px'});
    const [propsEditorVisible, setPropsEditorVisible] = useState(false);

    const wrapperCol = {flex: '1 1 0%'};

    useEffect(() => {
        form.resetFields();

        const {componentName, props: nodeProps = {}} = selectedNode || {};
        const componentConfig = getComponentConfig(componentName);

        const {fields = []} = componentConfig || {};

        setPropFields(fields);

        // 回显表单 设置默认值
        const fieldValues = {...nodeProps};

        // 自大字符标签
        let maxLabel = '';

        // 设置默认属性
        fields.forEach(item => {
            const {field, label, defaultValue} = item;
            if (label.length > maxLabel.length) maxLabel = label;
            if (fieldValues[field] === undefined) {
                fieldValues[field] = defaultValue;
            }
        });

        // 设置表单
        form.setFieldsValue(fieldValues);

        // 设置label宽度
        const labelWidth = getLabelWidth(maxLabel);

        setLabelCol({flex: `${labelWidth}px`});

    }, [selectedNode, refreshProps, propsEditorVisible]);

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
        const getElement = elementMap[type];
        const title = tip || desc || label;

        let FormElement = () => <span style={{color: 'red'}}>TODO {type} 对应的表单元素不存在</span>;

        if (getElement) {
            FormElement = elementMap[type](item);
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
                    <FormElement onKeyDown={handleKeyDown}/>
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


    useEffect(() => {
        if (propsEditorVisible && rightSideWidth < 440) {
            dragPageAction.setRightSideWidth(440);
        }
    }, [propsEditorVisible, rightSideWidth]);

    return (
        <div ref={containerRef}>
            <PropsEditor
                editorRootEle={containerRef.current}
                onChange={values => onChange({}, values, true)}
                visible={propsEditorVisible}
                onCancel={() => setPropsEditorVisible(false)}
                selectedNode={selectedNode}
            />
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
                                onClick={() => setPropsEditorVisible(!propsEditorVisible)}
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
        </div>
    );
}
