import useManage from '@/hooks/useManage';
import { addRole, deleteRole, enableRole, getListRoles, getMembersByRoleId, updateRole } from '@/services/role';
import scopedClasses from '@/utils/scopedClasses';
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  Space,
  Switch,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import Auth from './components/auth';
import Role from './components/role';
import './index.less';

const sc = scopedClasses('system-config-auth');

export type EditType = {
  id?: string | number	// 主键自增id	
  name?: string	// 角色名称	
  description?: string	// 角色描述	
  enable?: boolean	// 是否启用 true启用 false不启用	
  createTime?: string	// 创建时间
};



export default () => {
  const [selectItem, setSelectItem] = useState<EditType | undefined>();
  const [initDataSource, setInitDataSource] = useState<EditType[]>([]);




  const [dataSource, setDataSource] = useState<(EditType & {
    html_name?: string
    html_description?: string
  })[]>([]);
  // 因为需要将状态带回给后端 所以需要存储
  // const [courseState, setCourseState] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [roleModal, setRoleModal] = useState<{
    visible: boolean
  } & EditType>({
    visible: false
  });
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  /**
   * 准备数据和路由获取参数等
   */
  const prepare = async () => {
    getRoles((result) => {
      if (result && result?.length > 0) {
        setSelectItem(result?.[0]);
      }
    })
  };

  // 获取所有角色
  const getRoles = async (callback?: (arg0: any) => any) => {
    try {
      const rolesRes = await getListRoles();
      if (rolesRes.code === 0) {
        setDataSource(rolesRes.result || []);
        searchContent && onSearchRole(searchContent)
        setInitDataSource(rolesRes.result || []);
        callback && callback(rolesRes.result || [])
      } else {
        message.error(`获取角色失败，原因:{${rolesRes.message}}`);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
  }, []);

  const remove = async (id: string) => {
    try {

      const { result } = await getMembersByRoleId(id as string);

      if(result?.length>0){
        Modal.info({
          title: '提示',
          content: '请先移除当前角色下的成员'
        })
        return
      }

      const rolesRes = await deleteRole(id);
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

  const [searchContent, setSearchContent] = useState<string>()
  const onSearchRole = (searchContent: string) => {

    setSearchContent(searchContent)

    if (searchContent.length == 0) {
      setDataSource(initDataSource)
      return
    }
    if (searchContent.length == 1) {
      setDataSource([])
      return
    }

    const searchResult: any[] = []
    initDataSource.map(p => {
      if (p?.name?.indexOf(searchContent || '') > -1 || p?.description?.indexOf(searchContent) > -1) {

        searchResult.push({
          ...p,
          html_name: p?.name?.split(searchContent).join("<span style='color:blue;'>" + searchContent + "</span>"),
          html_description: p?.description?.split(searchContent).join("<span style='color:blue;'>" + searchContent + "</span>")
        })
      }
    })
    setDataSource(searchResult)
  }

  const settings = () => {
    return (
      <div>
        <Card
          type="inner"
          bodyStyle={{
            height: 'calc(100vh - 250px)',
            overflowY: 'auto'
          }}
        >
          <Button disabled={!isManage} onClick={() => {
            setRoleModal({ visible: true })
          }} type="primary" icon={<PlusOutlined />} style={{ width: '100%' }}>
            新增角色
          </Button>
          <div style={{ width: '100%', height: 1, background: '#ccc', margin: '10px 0' }}></div>
          <Input onChange={(e) => onSearchRole(e.target.value)} prefix={
            <SearchOutlined />
          } allowClear></Input>
          {dataSource.map((p, index) => (
            <div
              className="role-item"
              key={'role' + index}
              style={
                selectItem?.id === p.id
                  ? { backgroundColor: '#6680ff', color: '#fff' }
                  : (p?.enable ? undefined : { backgroundColor: '#ccc' })
              }
              onClick={() => {
                setSelectItem(p)
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  className="role-item-title" dangerouslySetInnerHTML={{ __html: (p?.html_name || p?.name || '') }}>
                </div>
                <div
                  className={'option'}
                >
                  <Space size={5}>
                    <EditOutlined
                      onClick={() => {
                        setRoleModal({
                          visible: true,
                          id: p?.id
                        })
                        form.setFieldsValue({
                          ...p
                        })
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => {
                        Modal.confirm({
                          title: '提示',
                          icon: <ExclamationCircleOutlined />,
                          content: '确定删除',
                          okText: '删除',
                          okButtonProps: {
                            disabled: !isManage
                          },
                          onOk: () => remove(p?.id),
                          cancelText: '取消',
                        });
                      }}
                      className="icon-option"
                    />
                  </Space>
                </div>
              </div>

              <div className="role-item-desc" dangerouslySetInnerHTML={{ __html: (p?.html_description || p?.description || '') }}>
              </div>

            </div>
          ))}
        </Card>
      </div>
    );
  };

  const [tab, setTab] = useState<number>(1)
  const selectButton = (): React.ReactNode => {
    return (
      <Radio.Group style={{ margin: '10px 0' }} value={tab} onChange={(e) => { setTab(e.target.value) }}>
        <Radio.Button value={1}>角色成员</Radio.Button>
        <Radio.Button value={2}>权限配置</Radio.Button>
      </Radio.Group>
    );
  };
  const isManage = useManage()
  const options = () => {
    return (
      <div>
        <Card
          type="inner"
          bodyStyle={{
            height: 'calc(100vh - 250px)',
            overflowY: 'auto'
          }}
        >
          {(!selectItem?.id) ? (
            <Empty className="empty" description="请先在左边操作框新建角色/选择角色" />
          ) : <>
            <div style={{ margin: '20 0', display: 'flex', alignContent: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ marginRight: 20 }}>{selectItem?.name}</span>
                <span>创建时间：{selectItem?.createTime}</span>
              </div>
              <div>
                <Switch disabled={!isManage} checkedChildren="开启" unCheckedChildren="关闭" style={{ marginRight: 20 }} checked={selectItem?.enable} onChange={(e) => {
                  onChangeRoleEnabled(e)
                }} />
                <Tooltip placement="left" title="角色开启时，该角色对应的成员账号才能正常使用">
                  <QuestionCircleFilled />
                </Tooltip>
              </div>
            </div>
            {selectButton()}
            {tab == 1 && <Role current={selectItem} />}
            {tab == 2 && <Auth current={selectItem} />}
          </>}
        </Card>
      </div>
    );
  };

  const onChangeRoleEnabled = async (e: boolean) => {
    const updateRoleStatus = async (enable: boolean) => {
      try {
        const res = await enableRole({
          id: selectItem?.id,
          enable
        })
        if (res.code === 0) {
          message.success(`操作成功`);
          getRoles((res) => {
            setSelectItem(res?.filter(p => p.id == selectItem?.id)?.[0])
          })
        } else {
          message.error(`操作失败，原因:{${res.message}}`);
        }
      } catch (error) {
        console.log('error', error);
        message.error('操作失败');
      }
    }
    if (!e) {
      Modal.confirm({
        title: '提示',
        content: '停用后，该角色下的用户账号不可使用该角色对应的权限',
        onOk: () => {
          // 关闭角色
          updateRoleStatus(e)
        },
        okText: '停用'
      })
      return
    }
    // 打开角色
    updateRoleStatus(e)
  }

  const addOrUpdateRole = () => {
    const action = roleModal?.id ? updateRole : addRole;
    form
      .validateFields()
      .then(async (values) => {
        setAddOrUpdateLoading(true)
        const res = await action({
          id: roleModal?.id,
          ...values
        });
        if (res?.code == 0) {
          message.success('提交成功')
          form.resetFields();
          setRoleModal({ visible: false })
          getRoles()
        } else {
          message.error(res?.message || '提交成功')
        }
      })
      .catch((err) => {
        console.log(err);
      }).finally(() => {
        setAddOrUpdateLoading(false)
      });
  }

  return (
    <PageContainer
      className={sc('container')}
    >
      <Row gutter={10}>
        <Col span={4}>{settings()}</Col>
        <Col span={20}>
          {options()}
        </Col>
      </Row>
      <Modal
        title={'新增角色'}
        width="400px"
        visible={roleModal.visible}
        maskClosable={false}
        onCancel={() => {
          setRoleModal({ visible: false });
          form.resetFields()
          // eslint-disable-next-line
          uploadLoading && setUploadLoading(false);
        }}
        centered
        destroyOnClose
        onOk={async () => {
          // 提交角色
          addOrUpdateRole()
        }}
        okButtonProps={{
          disabled: !isManage
        }}
        confirmLoading={addOrUpdateLoading}
      >

        <Form form={form} layout={'vertical'}>
          <Form.Item name="name" label="角色名称">
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          <Form.Item name="description" label="角色介绍">
            <Input.TextArea
              placeholder="请输入"
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={50}
            />
          </Form.Item>
        </Form>

      </Modal>
    </PageContainer>
  );
};