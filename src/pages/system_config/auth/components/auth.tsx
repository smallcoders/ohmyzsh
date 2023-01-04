import {
    Button,
    message as antdMessage,
    Checkbox,
    Table,
} from 'antd';
import '../index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useMemo, useState } from 'react';

import { getPermissionById, getPermissionConfigForm, updatePermissions } from '@/services/auth';
import { EditType } from '..';
import isManage from '@/hooks/useManage';

const sc = scopedClasses('system-config-auth-auth');

export default ({ current }: { current?: EditType }) => {
    const [dataSource, setDataSource] = useState<any[]>([]);

    const prepare = async () => {
        try {
            const res = await Promise.all([getPermissionConfigForm(), getPermissionById(current?.id as string)]);
            setDataSource(res?.[0]?.result);
            setCheckedAuths(res?.[1]?.result?.map(p => p?.id) || []);
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        }
    };

    useEffect(() => {
        prepare()
    }, [current?.id])

    // 根据antd 的合并规则 处理columns
    const getColumn = () => {

        const menuLength: number[] = [0]
        const menuTag: number[] = []
        let rows = 0
        dataSource.map(p => {
            menuLength.push(
                rows + (p.childNodes?.length || 1)
            )
            menuTag.push(
                p.childNodes?.length || 1
            )
            rows += p.childNodes?.length || 1
        })
        let flag = 0;

        return [
            {
                dataIndex: 'levelV1',
                onCell: (_, index) => {
                    if (menuLength.includes(index)) {
                        flag++

                        return {
                            rowSpan: menuTag[flag - 1],
                        }
                    } else {
                        return {
                            rowSpan: 0
                        }
                    }
                },
                render: (item: any) => {
                    const [indeterminate, check] = judgeContain(item?.includeChildren)
                    return <Checkbox
                        disabled={!editEnable}
                        onChange={(e) => {
                            dealAllCheck(e.target.checked, item?.includeChildren)
                        }}
                        indeterminate={check ? false : indeterminate} checked={check}>
                        {item?.menuName}
                    </Checkbox>
                },
            },
            {
                dataIndex: 'levelV2',
                render: (item: any) => {
                    const [indeterminate, check] = judgeContain(item?.includeChildren)
                    return item?.menuCode ? <Checkbox
                        disabled={!editEnable}
                        onChange={(e) => {
                            dealAllCheck(e.target.checked, item?.includeChildren)
                        }}
                        indeterminate={check ? false : indeterminate} checked={check}>
                        {item?.menuName}
                    </Checkbox> : undefined
                },
            },
            {
                dataIndex: 'levelV3',
                render: (item: any[]) => {
                    return item?.map(p => {
                        return <Checkbox
                            disabled={!editEnable}
                            checked={checkedAuths?.indexOf(p?.id) > -1} onChange={(_) => {
                                saveAuth(p?.id)
                            }}>
                            {p?.permissionName}
                        </Checkbox>
                    }
                    )
                }
            },
        ]
    }

    const dealAllCheck = (check: boolean, includeChildren: any[]) => {
        if (check) {
            includeChildren?.map((p) => {
                setCheckedAuths((pre) => {
                    const checked = [...pre]
                    const index = checked.indexOf(p)
                    if (index === -1) {
                        return [...checked, p]
                    }
                    return [...checked]
                })
            })
        } else {
            includeChildren?.map((p) => {
                saveAuth(p)
            })
        }
    }

    const saveAuth = (code: string) => {
        setCheckedAuths((pre) => {
            const checked = [...pre]
            const index = checked.indexOf(code)
            if (index > -1) {
                checked.splice(index, 1);
                return checked
            } else {
                return [...checked, code]
            }
        })
    }
    const judgeContain = (includeChildren: string | any[]) => {
        let indeterminate = false, check = true
        for (let index = 0; index < includeChildren?.length; index++) {
            const element = includeChildren[index];
            if (!(checkedAuths.indexOf(element) > -1)) {
                check = false
            } else {
                indeterminate = true
            }
        }
        return [indeterminate, check]
    }

    const [checkedAuths, setCheckedAuths] = useState<string[]>([])

    const getData = () => {
        const data: any[] = []
        dataSource.map(p => {
            let levelV1Includes: any[] = []
            if (p?.childNodes?.length > 0) {

                p?.childNodes?.map(c => {
                    c?.permissions?.map(c => {
                        levelV1Includes.push(c?.id)
                    })
                })

                p?.childNodes?.map(c => {
                    data.push({
                        levelV1: { ...p, includeChildren: [...levelV1Includes] },
                        levelV2: { ...c, includeChildren: c?.permissions?.map(p => p.id) },
                        levelV3: c?.permissions
                    })
                })
            } else {
                p?.permissions?.map(c => {
                    levelV1Includes.push(c?.id)
                })
                if (p?.permissions?.length > 0) {
                    data.push({
                        levelV1: { ...p, includeChildren: [...levelV1Includes] },
                        levelV2: {},
                        levelV3: p?.permissions
                    })
                }
            }
        })

        return data
    }

    const allCheck = useMemo(() => {
        const data: any[] = []
        dataSource.map(p => {
            if (p?.childNodes?.length > 0) {
                p?.childNodes?.map(c => {
                    c?.permissions?.map(e => {
                        data.push(e?.id)
                    })
                })
            } else {
                p?.permissions?.map(e => {
                    data.push(e?.id)
                })
            }
        })
        return data
    }, [dataSource])

    const [allIndeterminate, allChecked] = judgeContain(allCheck)

    const [editEnable, setEditEnable] = useState<boolean>(false)
    const [updateLoading, setUpdateLoading] = useState<boolean>(false)
    const submit = async () => {
        try {
            setUpdateLoading(true)
            const { code, message } = await updatePermissions({
                roleId: current?.id,
                permissionIds: checkedAuths
            });
            if (code === 0) {
                antdMessage.success('更新成功')
                prepare()
                setEditEnable(false)
            } else {
                throw new Error(message);
            }
        } catch (error) {
            antdMessage.error(`请求失败，原因:{${error}}`);
        } finally {
            setUpdateLoading(false)
        }
    }

    return (
        <div className={sc()}>
            {allIndeterminate}
            <div className={sc('container-table-header')}>
                <div className="title">
                    <div>
                        <span style={{ marginRight: 10 }}>选择该角色所需权限</span>
                        <Checkbox
                            disabled={!editEnable}
                            indeterminate={allChecked ? false : allIndeterminate} checked={allChecked}
                            onChange={(e) => {
                                dealAllCheck(e.target.checked, allCheck)
                            }}>
                            全选
                        </Checkbox>
                    </div>
                </div>
                <Button
                  disabled={!isManage()}
                    type="primary"
                    loading={updateLoading}
                    onClick={() => {
                        editEnable ? submit() : setEditEnable(true)
                    }}>
                    {editEnable ? '完成' : '编辑'}</Button>
            </div>
            <div className={sc('container-table-body')}>
                <Table size='small' pagination={false} columns={getColumn()} dataSource={getData()} bordered />
            </div>
        </div>
    );
};
