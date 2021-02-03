import React from 'react';
import PropTypes from 'prop-types';
import {Radio, Tooltip} from 'antd';
import './style.less';

const RadioGroup = props => {
    const {options, onChange, ...others} = props;

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
                // 再次点击选中清空
                setTimeout(() => {
                    if (props.value === value) {
                        onChange && onChange(undefined);
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
            styleName="root"
            options={renderOptions(options)}
            optionType="button"
            buttonStyle="solid"
            onChange={onChange}
            {...others}
        />
    );
};

RadioGroup.propTypes = {
    options: PropTypes.array,
};

export default RadioGroup;
