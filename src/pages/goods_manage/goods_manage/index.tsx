import { pageQuery } from '@/services/order/order-manage';
import type DataCommodity from '@/types/data-commodity';
import {DownOutlined} from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Access, useAccess } from 'umi';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import { useCallback, useRef, useState } from 'react';
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
  const [useListRoles, setUseListRoles] = useState<any>([]) // 查询所有角色
  const [activeStatusData, setActiveStatusData] = useState({});
  const paginationRef = useRef<{ current?: number; pageSize?: number }>({
    current: 0,
    pageSize: 0,
  });

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

  const columns: ProColumns<DataCommodity.Commodity>[] = [
    {
      title: '权重',
      hideInSearch: true,
      renderText: (_, __, index: number) =>
        ((paginationRef.current.current ?? 0) - 1) * (paginationRef.current.pageSize ?? 10) +
        index +
        1,
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

          {record.saleStatus === 0 && (
            <Access accessible={access['P_PM_SP']}>
              <Button size="small" type="link" onClick={() => goEdit(record)}>
                权重
              </Button>
              <Dropdown overlay={moreMenu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(record as any)}}>
                  更多 <DownOutlined />
                </a>
              </Dropdown>
            </Access>
          )}
        </>
      ),
    },
  ];
  const access = useAccess()
  const moreMenu = (
    <Menu >
      {activeStatusData=='DOWN'&&
      <Menu.Item key={'1'}>
        <a
          href="#"
          onClick={() => {
            // editActivity()
          }}
        >编辑</a>
      </Menu.Item>}
      {activeStatusData=='UP'&&
      <Menu.Item key={'2'}>
        <Popconfirm
          title="下架后该链接将会失效，确认下架？？"
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
          okText="下架"
          cancelText="取消"
          // onConfirm={ soldOut}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
        </Popconfirm>
      </Menu.Item>}
      <Menu.Item key={'3'}>
        <Popconfirm
          title="删除后该链接将会失效，且不可恢复，确认删除？"
          okText="删除"
          cancelText="取消"
          // onConfirm={remove}
        >
          <a href="#">删除</a>
        </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  //更多下拉
  const handleMoreMenuClick=(e: any)=> {
    // const {startTime ,endTime} = e
    // const result=e
    // const time = [
    //   result.time=moment(startTime),
    //   result.time=moment(endTime),
    // ]
    // result.time=time
    setActiveStatusData(e.activeStatus)
    // setRemoveData(e.id)
    // setColumnData(result)
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
