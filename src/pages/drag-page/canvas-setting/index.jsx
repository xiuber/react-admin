import React, {useEffect} from 'react';
import {Form} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';
import RadioGroup from 'src/pages/drag-page/component-style/radio-group';
import {isMac} from 'src/pages/drag-page/util';

import './style.less';

const layout = {
    labelCol: {flex: '60px'},
    wrapperCol: {flex: '1 1 0%'},
};

export default config({
    connect: state => {
        return {
            canvasWidth: state.dragPage.canvasWidth,
            canvasHeight: state.dragPage.canvasHeight,
            nodeSelectType: state.dragPage.nodeSelectType,
        };
    },
})(function ComponentTree(props) {
    const {
        canvasWidth,
        canvasHeight,
        nodeSelectType,
        action: {dragPage: dragPageAction},
    } = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        const {
            canvasWidth,
            canvasHeight,
            nodeSelectType,
        } = allValues;
        dragPageAction.setCanvasWidth(canvasWidth);
        dragPageAction.setCanvasHeight(canvasHeight);
        dragPageAction.setNodeSelectType(nodeSelectType);
    }

    useEffect(() => {
        form.setFieldsValue({nodeSelectType});
    }, [nodeSelectType]);

    useEffect(() => {
        form.setFieldsValue({canvasWidth});
    }, [canvasWidth]);

    useEffect(() => {
        form.setFieldsValue({canvasHeight});
    }, [canvasHeight]);

    // TODO 提供 iphoneX PC 等预设

    return (
        <Pane
            header={
                <div>
                    <AppstoreOutlined style={{marginRight: 4}}/>
                    画布设置
                </div>
            }
        >
            <div styleName="root">
                <Form
                    form={form}
                    onValuesChange={handleChange}
                    name="canvasSetting"
                >
                    <Form.Item
                        {...layout}
                        label="宽度"
                        name="canvasWidth"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                    <Form.Item
                        {...layout}
                        label="高度"
                        name="canvasHeight"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                    <Form.Item
                        {...layout}
                        label="选中元素"
                        name="nodeSelectType"
                        colon={false}
                    >
                        <RadioGroup
                            showTooltip={false}
                            allowClear={false}
                            style={{width: '100%'}}
                            options={[
                                {value: 'click', label: '左键'},
                                {value: 'meta', label: `${isMac ? '⌘' : 'ctrl'}+左键`},
                            ]}
                        />
                    </Form.Item>
                </Form>
            </div>
        </Pane>
    );
});
