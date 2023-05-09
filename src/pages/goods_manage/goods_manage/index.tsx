import { pageQuery, modifySortNo } from '@/services/order/order-manage';
import { getApplicationTypeList } from '@/services/digital-application';
import type DataCommodity from '@/types/data-commodity';
import {DownOutlined} from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Access, useAccess } from 'umi';
import { Button, Dropdown, Menu, Popconfirm, Form, InputNumber, message, Cascader } from 'antd';
import { useCallback, useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  httpGetListRoles
} from '@/services/account';
// import {routeName} from '@/../con'
// 内容类型
const contentType = {
  '1': '供需简讯',
  '2': '企业动态',
  '3': '经验分享',
  '4': '供需简讯',
  '5': '供需简讯',
}
export default () => {
  const history = useHistory();
  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState(0);
  const [columnData, setColumnData] = useState<any>({})
  const [activeStatusData, setActiveStatusData] = useState({});
  const [applicationTypeList, setApplicationTypeList] = useState<any>([]);
  const paginationRef = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });
  const [weightForm] = Form.useForm();
  const [goodsTypeForm] = Form.useForm()

  const goEdit = useCallback(
    (record: { id: number }) => {
      history.push(`/purchase-manage/commodity-create?id=${record.id}`);
    },
    [history],
  );

  const goDetail = useCallback(
    (record: { id: number }) => {
      window.open(`/purchase-manage/commodity-detail?id=${record.id}`);
    },
    [history],
  );

  // 编辑权重
  const editSort = async (id: string, value: number) => {
    const editRes = await modifySortNo({
      id: id,
      sortNo: value,
    });
    if (editRes.code === 0) {
      message.success(`编辑权重成功！`);
      weightForm.resetFields()
    } else {
      message.error(`编辑权重失败，原因:{${editRes.message}}`);
    }
  };
  // 上/下架
  const upOrDown = async (value: number) => {
    const editRes = await modifySortNo({
      id: columnData.id,
      saleStatus: value,
    });
    if (editRes.code === 0) {
      message.success(`${value == 1 ? '上架成功！' : '下架成功！'}`);
      weightForm.resetFields()
    } else {
      message.error(`${value == 1 ? '上架' : '下架'}失败，原因:{${editRes.message}}`);
    }
  };

  const handleGetApplicationTypeList = () => {
    getApplicationTypeList().then(({ result }) => {
      setApplicationTypeList(result || []);
    });
  };

  useEffect(() => {
    handleGetApplicationTypeList()
  }, []);

  /**
   * 查询所有角色
   */
  const getListRolesData = async (enable?: boolean) => {
    try {
      const res = await httpGetListRoles(enable)
      if (res?.code === 0) {
        const list = res?.result?.map((item: any) => {
          return {
            label: item?.name,
            value: item?.id,
          }
        })
        // enable
        //   ? setUseListRoles(list || [])
        //   : setListRoles(list || [])
        return list
      } else {
        throw new Error("");
      }
    } catch (error) {
      // message.error('获取所有角色失败，请重试')
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '权重',
      hideInSearch: true,
      dataIndex: 'sortNo'
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      valueType: 'textarea',
      order: 5,
    },
    {
      title: '商品来源',
      dataIndex: 'appTypeName',
      valueType: 'textarea',
      hideInSearch: true,
    },
    {
      title: '商品类型',
      dataIndex: 'appTypeName',
      valueType: 'select',
      order: 5,
      request: async () => getListRolesData(false)
      // valueEnum: {
      //   1: {
      //     text: '供需简讯'
      //   },
      //   2: {
      //     text: '企业动态'
      //   },
      //   3: {
      //     text: '经验分享'
      //   },
      // },
      // renderText: (_: string) => {
      //   return (
      //     <div className={`state${_}`}>
      //       {Object.prototype.hasOwnProperty.call(contentType, _) ? contentType[_] : '--'}
      //     </div>
      //   );
      // },
    },
    {
      title: '所属组织',
      dataIndex: 'orgId',
      valueType: 'textarea',
      order: 4
    },
    {
      title: '价格区间',
      dataIndex: 'minSalePrice',
      valueType: 'textarea',
      renderText: (text: any, record: any) => record.minSalePrice && record.maxSalePrice ? (record.minSalePrice + '~' + record.maxSalePrice) : '--',
      hideInSearch: true,
    },
    {
      title: '商品状态',
      dataIndex: 'saleStatus',
      valueType: 'select',
      valueEnum: {
        1: {
          text: '发布中',
        },
        0: {
          text: '已下架',
        },
      },
    },
    {
      title: '所属标签',
      dataIndex: 'productTagNames',
      valueType: 'select',
      valueEnum: {
        2: {
          text: '行业精选',
        },
        1: {
          text: '消费券',
        },
        0: {
          text: '平台优选',
        },
      },
      // renderText: (text: any, record: any) => 
    },
    {
      title: '商业服务端',
      dataIndex: 'appType',
      valueType: 'select',
      width: 120,
      valueEnum: {
        1: {
          text: 'Web端',
        },
        0: {
          text: 'App端',
        },
        3: {
          text: 'App端、Web端'
        }
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_, record) => (
        <>
          <Button size="small" type="link" onClick={() => goDetail(record)}>
            详情
          </Button>
          <Access accessible={access['P_PM_SP']}>
            <Popconfirm
              title={
                <>
                  <Form form={weightForm}>
                    <Form.Item name={'weight'} label="权重设置"
                      validateTrigger="onBlur"
                      rules={[
                        {
                          validator: (_, value) => {
                            console.log(_, value)
                            if (value < 1 || value > 100) {
                              // message.error('允许输入权重数字范围为1～100');
                              return Promise.reject(new Error('允许输入权重数字范围为1～100'))
                            } else if (/^\d+\.\d{4,}/.test(value)) {
                              // message.error('小数点后最多取3位');
                              return Promise.reject(new Error('小数点后最多取3位'))
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <InputNumber placeholder='数字越大排序越靠前' />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<DownOutlined style={{ display: 'none' }} />}
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await weightForm.validateFields()
                editSort(record.id, weightForm.getFieldValue('weight'));
              }}
            >
              <Button
                key="1"
                size="small"
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({ weight: record.sortNo });
                }}
              >
                权重
              </Button>
            </Popconfirm>
            <Dropdown overlay={moreMenu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(record as any)}}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Access>
        </>
      ),
    },
  ];
  const access = useAccess()
  const moreMenu = (
    <Menu >
      <Menu.Item key={'1'}>
        <a
          href="#"
          onClick={() => {
            // editActivity()
          }}
        >标签</a>
      </Menu.Item>
      {activeStatusData==1&&
      <Menu.Item key={'2'}>
        <Popconfirm
          title="确认下架？"
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
          okText="下架"
          cancelText="取消"
          onConfirm={() => {
            upOrDown(0)
          }}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
        </Popconfirm>
      </Menu.Item>}
      {activeStatusData==0&&
      <Menu.Item key={'3'}>
        <Popconfirm
          title="确认上架？？"
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
          okText="上架"
          cancelText="取消"
          onConfirm={() => {
            upOrDown(1)
          }}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >上架</a>
        </Popconfirm>
      </Menu.Item>}
      <Menu.Item key={'4'}>
      <Popconfirm
        overlayStyle={{translate:'10px 40px', zIndex: 999}}
        title={
          <>
            <Form form={goodsTypeForm}>
              <Form.Item name={'goodsType'} label="商品类型"
                validateTrigger="onBlur"
              >
                <Cascader
                  // onChange={(val) => {
                    // setAppTypeId(val);
                  // }}
                  changeOnSelect
                  style={{ width: '200px' }}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  options={applicationTypeList}
                  placeholder="请选择"
                />
              </Form.Item>
            </Form>
          </>
        }
        icon={<DownOutlined style={{ display: 'none' }} />}
        okText="确定"
        cancelText="取消"
        onConfirm={async () => {
          // await weightForm.validateFields()
          // editSort(record.id, weightForm.getFieldValue('weight'));
        }}
      >
        <a
          href='#'
          onClick={() => {
            // weightForm.setFieldsValue({ weight: record.sortNo });
          }}
        >
          类型修改
        </a>
      </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  //更多下拉
  const handleMoreMenuClick=(record: any)=> {
    console.log(record)
    setActiveStatusData(record.saleStatus)
    // setRemoveData(e.id)
    setColumnData(record)
  }
  return (
    <PageContainer>
      <ProTable
        headerTitle={`商品列表（共${total}个）`}
        options={false}
        rowKey="id"
        search={{
          span: 6,
          labelWidth: 100,
          defaultCollapsed: false,
          collapseRender: () => false,
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        actionRef={actionRef}
        request={async (pagination) => {
          const timer = pagination.updateTime
            ? {
                timeStart: pagination.updateTime[0],
                timeEnd: pagination.updateTime[1],
              }
            : {};
          const result = await pageQuery({ ...pagination, ...timer });
          paginationRef.current = pagination;
          setTotal(result.totalCount);
          return { total: result.totalCount, success: true, data: result.result };
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </PageContainer>
  );
};
