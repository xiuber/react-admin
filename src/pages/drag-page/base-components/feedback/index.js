import React from 'react';
import {v4 as uuid} from 'uuid';
import modalImage from './modal.png';
import {SHOW_MODAL_FUNCTION} from 'src/pages/drag-page/util';

export default [
    {
        title: '警告提示',
        subTitle: '警告提示 Alert',
        children: [
            {
                title: '警告提示',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Alert',
                },
            },
        ],
    },
    {
        title: '抽屉',
        subTitle: '抽屉 Drawer',
        children: [
            {
                title: '抽屉',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Drawer',
                },
            },
        ],
    },
    {
        title: '全局提示',
        subTitle: '全局提示 Message',
        children: [
            {
                title: '全局提示',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Message',
                },
            },
        ],
    },
    {
        title: '对话框',
        subTitle: '对话框 Modal',
        children: [
            {
                title: '对话框',
                // renderPreview: true,
                image: modalImage,
                config: {
                    __config: {
                        // draggable: false,
                        componentDisplayName: ({node}) => {
                            const {componentName, props = {}} = node;
                            const {title} = props;

                            if (!title) return componentName;

                            return (
                                <>
                                    {componentName}
                                    <span style={{marginLeft: 4}}>{title}</span>
                                </>
                            );
                        },

                        propsToSet: {
                            onClick: SHOW_MODAL_FUNCTION,
                        },
                        actions: {
                            onCancel: event => options => {
                                event.stopPropagation();

                                const {
                                    // pageConfig, // 页面整体配置
                                    dragPageAction, // 页面action
                                    node, // 当前组件配置
                                } = options;
                                if (!node.props) node.props = {};

                                node.props.visible = false;

                                // props 改之后，重新设置key，使组件重新渲染
                                node.props.key = uuid();

                                dragPageAction.render(); // props改变了，重新出发页面渲染
                                dragPageAction.refreshProps(); // 刷新属性面板
                            },
                        },
                    },
                    componentName: 'Modal',
                    props: {
                        title: '弹框标题',
                        maskClosable: false,
                        footer: true,
                        bodyStyle: {
                            padding: 0,
                        },
                    },
                    children: [
                        {
                            componentName: 'div',
                            children: [
                                {
                                    componentName: 'DragHolder',
                                    props: {
                                        style: {height: 200},
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'ModalFooter',
                            props: {
                                className: 'ant-modal-footer',
                            },
                            children: [
                                {
                                    componentName: 'Button',
                                    children: [
                                        {
                                            componentName: 'Text',
                                            props: {
                                                text: '取消',
                                                isDraggable: false,
                                            },
                                        },
                                    ],
                                },
                                {
                                    componentName: 'Button',
                                    props: {
                                        type: 'primary',
                                    },
                                    children: [
                                        {
                                            componentName: 'Text',
                                            props: {
                                                text: '确定',
                                                isDraggable: false,
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
            {
                title: '对话框底部',
                renderPreview: true,
                previewStyle: {width: '100%'},
                previewZoom: .8,
                config: {
                    __config: {
                        renderComponentName: 'div',
                    },
                    componentName: 'ModalFooter',
                    props: {
                        className: 'ant-modal-footer',
                    },
                    children: [
                        {
                            componentName: 'Button',
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '取消',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                        {
                            componentName: 'Button',
                            props: {
                                type: 'primary',
                            },
                            children: [
                                {
                                    componentName: 'Text',
                                    props: {
                                        text: '确定',
                                        isDraggable: false,
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    },
    {
        title: '通知提醒框',
        subTitle: '通知提醒框 Notification',
        children: [
            {
                title: '通知提醒框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Notification',
                },
            },
        ],
    },
    {
        title: '气泡确认框',
        subTitle: '气泡确认框 Popconfirm',
        children: [
            {
                title: '气泡确认框',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Popconfirm',
                },
            },
        ],
    },
    {
        title: '进度条',
        subTitle: '进度条 Progress',
        children: [
            {
                title: '进度条',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Progress',
                },
            },
        ],
    },
    {
        title: '结果',
        subTitle: '结果 Result',
        children: [
            {
                title: '结果',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Result',
                },
            },
        ],
    },
    {
        title: '骨架屏',
        subTitle: '骨架屏 Skeleton',
        children: [
            {
                title: '骨架屏',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                        withWrapper: true,
                    },
                    componentName: 'Skeleton',
                },
            },
        ],
    },
    {
        title: '加载中',
        subTitle: '加载中 Spin',
        children: [
            {
                title: '加载中',
                renderPreview: true,
                config: {
                    __config: {
                        isContainer: false,
                    },
                    componentName: 'Spin',
                },
            },
        ],
    },
];
