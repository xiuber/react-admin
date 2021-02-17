import React from 'react';
import {
    EyeOutlined,
    FormOutlined,
    CodeOutlined,
    SaveOutlined,
    DeleteOutlined,
    CloudServerOutlined,
} from '@ant-design/icons';

import config from 'src/commons/config-hoc';
import './style.less';
import {isMac} from '../util';
import Undo from '../undo';

export default config({
    connect: state => {

        return {
            activeToolKey: state.dragPage.activeToolKey,
            selectedNodeId: state.dragPage.selectedNodeId,
        };
    },
})(function Top(props) {
    const {
        activeToolKey,
        selectedNodeId,
        action: {dragPage: dragPageAction},
    } = props;
    const tools = [
        {
            key: 'layout',
            icon: <FormOutlined/>,
            label: '布局模式',
            onClick: () => dragPageAction.setActiveTookKey('layout'),
        },
        {
            key: 'preview',
            icon: <EyeOutlined/>,
            label: '预览模式',
            onClick: () => dragPageAction.setActiveTookKey('preview'),
        },
        'divider',
        {
            key: 'undo',
        },
        'divider',
        {
            key: 'code',
            icon: <CodeOutlined/>,
            label: '代码',
            onClick: () => dragPageAction.showCode(true),
        },
        {
            key: 'save',
            icon: <SaveOutlined/>,
            label: `保存(${isMac ? '⌘' : 'ctrl'}+s)`,
            onClick: () => dragPageAction.save(),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined/>,
            label: `删除(${isMac ? '⌘' : 'ctrl'}+d)`,
            disabled: !selectedNodeId,
            onClick: () => dragPageAction.deleteNodeById(selectedNodeId),
        },
        {
            key: 'saveAs',
            icon: <CloudServerOutlined/>,
            label: '另存为',
            disabled: !selectedNodeId,
            onClick: () => {
                // TODO
            },
        },
    ];
    return (
        <div styleName="root">
            <div styleName="left"/>
            <div styleName="center">
                {tools.map(item => {
                    if (item === 'divider') {
                        return <div styleName="divider"/>;
                    }

                    let {key, icon, label, onClick, disabled} = item;
                    if (key === 'undo') return <Undo/>;

                    const isActive = key === activeToolKey;

                    if (disabled) onClick = undefined;

                    const styleNames = ['toolItem'];
                    if (isActive) styleNames.push('active');
                    if (disabled) styleNames.push('disabled');

                    return (
                        <div key={key} styleName={styleNames.join(' ')} onClick={onClick}>
                            <span styleName="icon">{icon}</span>
                            <span styleName="label">{label}</span>
                        </div>
                    );
                })}
            </div>
            <div styleName="right"/>
        </div>
    );
});
