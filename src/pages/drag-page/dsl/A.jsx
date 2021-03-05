import React, { useState } from 'react';
import config from 'src/commons/config-hoc';
import { PageContent, QueryBar, ToolBar } from 'ra-lib';
import {
    Form,
    Input,
    InputNumber,
    Select,
    DatePicker,
    Button,
    Table,
    Divider,
    Popconfirm,
    Modal,
} from 'antd';

const Item = Form.Item;

export default config({
    path: '/route',
})(function Index(props) {
    const [selectedRowKeys, setSelectedRowKeys] = useState();
    const [visible1, setVisible1] = useState();

    function handleClick() {
        Modal.confirm({ title: '温馨提示', content: '您确定吗？' });
    }
    return (
        <PageContent>
            <QueryBar>
                <Form
                    layout="inline"
                    name="formName_ab886acc-1acd-40fe-86d7-270803d1f590"
                    onFinish={(values) => alert(JSON.stringify(values))}
                >
                    <Item label="姓名" name="name">
                        <Input placeholder="请输入姓名" />
                    </Item>
                    <Item label="年龄" name="age">
                        <InputNumber
                            style={{ width: '100%' }}
                            placeholder="请输入年龄"
                            min={0}
                        />
                    </Item>
                    <Item label="工作" name="job">
                        <Select
                            style={{ width: '100%' }}
                            placeholder="请选择工作"
                            options={[
                                { value: '1', label: '选项1' },
                                { value: '2', label: '选项2' },
                            ]}
                        />
                    </Item>
                    <Item label="入职日期" name="joinTime">
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="请选择入职日期"
                        />
                    </Item>
                    <Item>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button>重置</Button>
                    </Item>
                </Form>
                <ToolBar>
                    <Button type="primary" onClick={() => setVisible1(true)}>
                        添加
                    </Button>
                    <Button type="primary" danger={true} onClick={handleClick}>
                        批量删除
                    </Button>
                    <Button>导出</Button>
                </ToolBar>
            </QueryBar>
            <Table
                pagination={false}
                dataSource={[
                    { name: '张三', age: 25, operator: '修改' },
                    { name: '李四', age: 26, operator: '修改' },
                ]}
                columns={[
                    { title: '姓名', dataIndex: 'name' },
                    { title: '年龄', dataIndex: 'age' },
                    {
                        title: '操作',
                        dataIndex: 'operator',
                        render: () => (
                            <div>
                                <a>
                                    <span onClick={() => setVisible1(true)}>修改</span>
                                </a>
                                <Divider type="vertical" />
                                <Popconfirm title="您确定删除吗？">
                                    <a style={{ color: 'red' }}>删除</a>
                                </Popconfirm>
                            </div>
                        ),
                    },
                ]}
                rowSelection={{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys),
                }}
            />
            <Modal
                title="弹框标题"
                maskClosable={false}
                bodyStyle={{ padding: 0 }}
                visible={visible1}
                onCancel={() => setVisible1(false)}
            >
                <div
                    style={{
                        paddingTop: 16,
                        paddingRight: 16,
                        paddingBottom: 16,
                        paddingLeft: 16,
                    }}
                >
                    <Form
                        name="formName_abebbce9-0f4d-4281-9540-53d384ef48ca"
                        onFinish={(values) => alert(JSON.stringify(values))}
                    >
                        <Item label="姓名" name="name" labelCol={{ flex: '70px' }}>
                            <Input placeholder="请输入姓名" />
                        </Item>
                        <Item label="年龄" name="age" labelCol={{ flex: '70px' }}>
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="请输入年龄"
                                min={0}
                            />
                        </Item>
                        <Item label="工作" name="job" labelCol={{ flex: '70px' }}>
                            <Select
                                style={{ width: '100%' }}
                                placeholder="请选择工作"
                                options={[
                                    { value: '1', label: '选项1' },
                                    { value: '2', label: '选项2' },
                                ]}
                            />
                        </Item>
                        <Item label="入职日期" name="joinTime" labelCol={{ flex: '70px' }}>
                            <DatePicker
                                style={{ width: '100%' }}
                                placeholder="请选择入职日期"
                            />
                        </Item>
                    </Form>
                </div>
            </Modal>
        </PageContent>
    );
});
