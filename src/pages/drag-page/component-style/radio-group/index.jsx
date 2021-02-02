import React from 'react';
import PropTypes from 'prop-types';
import {Radio, Tooltip} from 'antd';

const RadioGroup = props => {
    const {id, form, options, handleChange, ...others} = props;
    const field = id.includes('_') ? id.split('_')[1] : id;

    function renderOptions(options) {
        return options.map((item, index) => {
            const {
                value,
                label,
                icon,
                tip,
            } = item;

            const isLast = index === options.length - 1;

            let title = tip || label;
            const la = icon || label;

            function handleClick() {
                const prevValue = form.getFieldValue(field);

                if (prevValue !== value) return;

                setTimeout(() => {
                    const fields = {[field]: undefined};
                    form.setFieldsValue(fields);

                    // 取消选中时，handleChange不触发，手动触发一次
                    if (prevValue === value) {
                        handleChange && handleChange(fields, form.getFieldsValue());
                    }
                });
            }

            let labelNode = (
                <Tooltip placement={isLast ? 'topRight' : 'top'} title={`${title} ${value}`}>
                    <div style={{userSelect: 'none'}} onClick={handleClick}>
                        {la}
                    </div>
                </Tooltip>
            );

            return {
                value,
                label: labelNode,
            };
        });
    }

    return (
        <Radio.Group
            options={renderOptions(options)}
            optionType="button"
            buttonStyle="solid"
            id={id}
            {...others}
        />
    );
};

RadioGroup.propTypes = {
    options: PropTypes.array,
    form: PropTypes.object,
    handleChange: PropTypes.func,
    field: PropTypes.any,
};

export default RadioGroup;
