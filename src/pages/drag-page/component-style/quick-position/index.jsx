import React from 'react';
import PropTypes from 'prop-types';
import {PicCenterOutlined} from '@ant-design/icons';
import {Tooltip} from 'antd';
import classNames from 'classnames';
import './style.less';

const quickPositionOptions = [
    {value: 'topLeft', icon: <PicCenterOutlined/>, label: '左上角'},
    {value: 'top', icon: <PicCenterOutlined/>, label: '上居中'},
    {value: 'topRight', icon: <PicCenterOutlined/>, label: '右上角'},
    {value: 'left', icon: <PicCenterOutlined/>, label: '左居中'},
    {value: 'center', placement: 'top', icon: <PicCenterOutlined/>, label: '居中'},
    {value: 'right', icon: <PicCenterOutlined/>, label: '右居中'},
    {value: 'bottomLeft', icon: <PicCenterOutlined/>, label: '左下角'},
    {value: 'bottom', icon: <PicCenterOutlined/>, label: '下居中'},
    {value: 'bottomRight', icon: <PicCenterOutlined/>, label: '右下角'},
];

function QuickPosition(props) {
    const {onClick, type, selectedKey} = props;
    const isLine = type === 'line';

    const styleName = classNames(['root', type]);

    return (
        <div styleName={styleName}>
            {quickPositionOptions.map(item => {
                const {value, placement, label, icon} = item;

                const sk = typeof selectedKey === 'function' ? selectedKey(item) : selectedKey;

                const isSelected = value === sk;
                const styleName = classNames({
                    isSelected,
                });

                return (
                    <Tooltip key={value} placement={isLine ? 'top' : placement || value} title={label}>
                        <div
                            styleName={styleName}
                            style={{cursor: 'pointer'}}
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
    selectedKey: PropTypes.any,
};

QuickPosition.defaultProps = {
    type: 'line',
    onClick: () => undefined,
};

export default QuickPosition;
