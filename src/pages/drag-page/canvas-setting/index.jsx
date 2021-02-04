import React, {useEffect} from 'react';
import {Form} from 'antd';
import {AppstoreOutlined} from '@ant-design/icons';
import config from 'src/commons/config-hoc';
import Pane from '../pane';
import UnitInput from 'src/pages/drag-page/component-style/unit-input';

import './style.less';

export default config({
    connect: state => {
        return {
            canvasWidth: state.dragPage.canvasWidth,
            canvasHeight: state.dragPage.canvasHeight,
        };
    },
})(function ComponentTree(props) {
    const {
        canvasWidth,
        canvasHeight,
        action: {dragPage: dragPageAction},
    } = props;
    const [form] = Form.useForm();

    function handleChange(changedValues, allValues) {
        const {
            canvasWidth,
            canvasHeight,
        } = allValues;
        dragPageAction.setCanvasWidth(canvasWidth);
        dragPageAction.setCanvasHeight(canvasHeight);
    }

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
                        label="宽度"
                        name="canvasWidth"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                    <Form.Item
                        label="高度"
                        name="canvasHeight"
                        colon={false}
                    >
                        <UnitInput/>
                    </Form.Item>
                </Form>
            </div>
        </Pane>
    );
});
