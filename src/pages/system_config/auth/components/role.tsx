import {
    Button,
    message as antdMessage,
    Space,
    Popconfirm,
    Transfer,
    Modal,
    message,
} from 'antd';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import SelfTable from '@/components/self_table';
import { EditType } from '..';
import { getListMemberCandidates, getMembersByRoleId, removeMember, updateMembers } from '@/services/role';
import useManage from '@/hooks/useManage';
const sc = scopedClasses('system-config-auth-role');

export default ({ current }: { current?: EditType }) => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const prepare = async () => {
        try {
            const { result, code, message } = await getMembersByRoleId(current?.id as string);
            if (code === 0) {
                setDataSource(result);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        }
    };

    const remove = async (id: string) => {
        try {
            const rolesRes = await removeMember({
                roleId: current?.id,
                roleMemberId: id
            });
            if (rolesRes.code === 0) {
                message.success(`删除成功`);
                prepare()
            } else {
                message.error(`删除失败，原因:{${rolesRes.message}}`);
            }
        } catch (error) {
            console.log('error', error);
            message.error('删除失败');
        }
    };

    useEffect(() => {
        current?.id && prepare()
    }, [current?.id])

    useEffect(() => {
        getAllMember()
    }, [])


    const columns = [
        {
            title: '账号',
            dataIndex: 'loginName',
            width: 100,
        },
        {
            title: '姓名',
            dataIndex: 'name',
            isEllipsis: true,
            width: 100,
        },
        {
            title: '联系方式',
            dataIndex: 'phone',
            isEllipsis: true,
            width: 200,
        },
        {
            title: '操作',
            width: 100,
            fixed: 'right',
            dataIndex: 'option',
            render: (_: any, record: any) => {
                return <Space size={20}>
                    <Popconfirm
                        icon={null}
                        title={'确定移除该成员'}
                        onConfirm={() => {
                            remove(record?.id)
                        }}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            disabled={!isManage}
                            type="link"
                        >
                            移除
                        </Button>
                    </Popconfirm>
                </Space>
            },
        },
    ];

    // const transferColumns = [
    //     {
    //         title: '姓名',
    //         dataIndex: 'name',
    //     },
    //     {
    //         title: '账号',
    //         dataIndex: 'loginName',
    //         isEllipsis: true,
    //     },
    // ];

    const isManage = useManage()

    const [selectRoleModal, setSelectRoleModal] = useState<{
        visible: boolean
    }>({
        visible: false
    })

    const [selectRoleLoading, setSelectRoleLoading] = useState<boolean>(false)

    const [members, setMembers] = useState<any[]>([]);
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    const getAllMember = async () => {
        try {
            const { result, code, message } = await getListMemberCandidates();
            if (code === 0) {
                setMembers(result);
            } else {
                throw new Error(message);
            }
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        }
    }


    const onChange = (targetKeys: string[]) => {
        setSelectedKeys(targetKeys)
    }

    const submit = async () => {
        try {
            setSelectRoleLoading(true)
            const { code, message } = await updateMembers({
                roleId: current?.id,
                roleMemberIds: selectedKeys
            });
            if (code === 0) {
                prepare()
                setSelectRoleModal({ visible: false })
            } else {
                throw new Error(message);
            }
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        } finally {
            setSelectRoleLoading(false)
        }
    }

    return (
        <div>
            <div className={sc('container-table-header')}>
                <div className="title">
                    <span>全部成员(共{dataSource?.length || 0}人)</span>
                </div>
                <Button disabled={!isManage} type="primary" onClick={() => {
                    setSelectRoleModal({ visible: true })
                    setSelectedKeys(dataSource?.map(p => p?.id))
                }}>管理角色成员</Button>
            </div>
            <div className={sc('container-table-body')}>
                <SelfTable
                    bordered
                    scroll={{ x: 500 }}
                    columns={columns}
                    rowKey={'id'}
                    dataSource={dataSource}
                    pagination={false}
                    size={'small'}
                />
            </div>

            <Modal

                title={'管理角色成员'}
                width="600px"
                bodyStyle={{ minHeight: 500 }}
                visible={selectRoleModal.visible}
                maskClosable={false}
                onCancel={() => {
                    setSelectRoleModal({ visible: false });
                    // eslint-disable-next-line
                    selectRoleLoading && setSelectRoleLoading(false);
                }}
                centered
                destroyOnClose
                onOk={async () => {
                    submit()
                }}
                confirmLoading={selectRoleLoading}
            >

                <Transfer
                    listStyle={{
                        height: 460,
                        width: 260
                    }}
                    // columns={transferColumns}
                    showSearch
                    rowKey={record => record.id}
                    dataSource={members}
                    titles={['成员列表', '已选角色成员']}
                    targetKeys={selectedKeys}
                    onChange={onChange}
                    locale={{
                        itemUnit: '名', itemsUnit: '名',
                    }}
                    // selectedKeys={dataSource}
                    render={item => {
                        return <div>{item?.name}：{item?.loginName}</div>
                    }
                    }
                />

            </Modal>

        </div>
    );
};
