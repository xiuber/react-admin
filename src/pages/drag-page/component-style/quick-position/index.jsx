import React from 'react';
import PropTypes from 'prop-types';
import { PicCenterOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import './style.less';

const quickPositionOptions = [
    { value: 'topLeft', icon: <PicCenterOutlined />, label: '左上角', fieldsValue: { top: 0, left: 0 } },
    { value: 'top', icon: <PicCenterOutlined />, label: '上居中', fieldsValue: { top: 0, left: '50%', translateX: '-50%' } },
    { value: 'topRight', icon: <PicCenterOutlined />, label: '右上角', fieldsValue: { top: 0, right: 0 } },
    { value: 'left', icon: <PicCenterOutlined />, label: '左居中', fieldsValue: { top: '50%', left: 0, translateY: '-50%' } },
    { value: 'center', placement: 'top', icon: <PicCenterOutlined />, label: '居中', fieldsValue: { top: '50%', left: '50%', translateY: '-50%', translateX: '-50%' } },
    { value: 'right', icon: <PicCenterOutlined />, label: '右居中', fieldsValue: { top: '50%', right: 0, translateY: '-50%' } },
    { value: 'bottomLeft', icon: <PicCenterOutlined />, label: '左下角', fieldsValue: { bottom: 0, left: 0 } },
    { value: 'bottom', icon: <PicCenterOutlined />, label: '下居中', fieldsValue: { bottom: 0, left: '50%', translateX: '-50%' } },
    { value: 'bottomRight', icon: <PicCenterOutlined />, label: '右下角', fieldsValue: { right: 0, bottom: 0 } },
];

function QuickPosition(props) {
    const { onClick, type } = props;
    const isLine = type === 'line';


    return (
        <div styleName={`root ${type}`}>
            {quickPositionOptions.map(item => {
                const { value, placement, label, icon } = item;

                return (
                    <Tooltip key={value} placement={isLine ? 'top' : placement || value} title={label}>
                        <div
                            style={{ cursor: 'pointer' }}
                            onClick={() => onClick(item)}
                        >
                            {icon}
                        </div>
                    </Tooltip>
                );
            })}
        </div>
    );
}

QuickPosition.propTypes = {
    type: PropTypes.string,
    onClick: PropTypes.func,
};

QuickPosition.defaultProps = {
    type: 'line',
    onClick: () => undefined,
};

export default QuickPosition;
