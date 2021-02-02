import React, {} from 'react';
import { Form, Input } from 'antd';
import PropTypes from 'prop-types';
import { getNumberValueFromEvent } from '../../util';

function UnitInputItem(props) {
    const {
        form,
        handleChange,
        label,
        name,
        noStyle,
        colon,
        style,
        allowClear,
        placeholder,
    } = props;


    function handleKeyDown(e) {
        const { key, target: { value } } = e;
        const isUp = key === 'ArrowUp';
        const isDown = key === 'ArrowDown';

        if (isUp || isDown) e.preventDefault();

        if (!isUp && !isDown) return;

        let nextValue = value;

        if (!nextValue) nextValue = 0;
        // 为纯数字 直接转换为数字
        if (!window.isNaN(nextValue)) {
            nextValue = window.parseFloat(nextValue);
            if (isUp) nextValue += 1;
            if (isDown) nextValue -= 1;
        } else {
            // 带单位，增加数字
            const re = /(-?\d+)(\.\d+)?/.exec(nextValue);
            if (re) {
                const numStr = re[0];
                const tempValue = nextValue.replace(numStr, '<__>');
                let num = window.parseFloat(numStr);
                if (isUp) num += 1;
                if (isDown) num -= 1;
                nextValue = tempValue.replace('<__>', num);
            }
        }

        const fields = { [name]: nextValue };
        form.setFieldsValue(fields);

        // 触发change事件
        handleChange && handleChange(fields, form.getFieldsValue());
    }

    return (
        <Form.Item
            label={label}
            name={name}
            noStyle={noStyle}
            colon={colon}
            getValueFromEvent={getNumberValueFromEvent}
        >
            <Input
                style={style}
                allowClear={allowClear}
                placeholder={placeholder}
                autocomplete="off"
                onKeyDown={handleKeyDown}
            />
        </Form.Item>
    );

}

UnitInputItem.propTypes = {
    allowClear: PropTypes.bool,
    form: PropTypes.object,
    handleChange: PropTypes.func,
    value: PropTypes.any,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
};
UnitInputItem.defaultProps = {
    allowClear: true,
    handleChange: () => undefined,
    placeholder: '请输入',
};

export default UnitInputItem;
