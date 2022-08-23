import { useState, useEffect } from 'react';
import { Form, Button, message, Modal } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import Common from '@/types/common.d';
import { routeName } from '@/../config/routes';
import { history, useModel } from 'umi';
import SelfTable from '@/components/self_table';
import SearchBar from '@/components/search_bar';

import './index.less'
import LeaveWordVerify from '@/types/leave-word-verify';
const sc = scopedClasses('leave-word-audit');

const stateObj = {
  UN_CHECK: '未审核',
  CHECKED: '审核通过',
  UN_PASS: '审核拒绝',
  UN_COMMIT: '未提交',
  INVALID: '未提交已失效',
};

export default () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<LeaveWordVerify.Content[]>([]);
  const { pageInfo, setPageInfo, orgName, setOrgName, resetModel } = useModel(
    'useLeaveWordVerify',
  );

  useEffect(()=>{
    // 初始化searchInfo
    form?.setFieldsValue({ orgName })
    // 获取分页数据
    getLeaveWordVerifyPage(orgName, pageInfo?.pageSize, pageInfo?.pageIndex)
    // 
    console.log('@history', history)
  },[])

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: LeaveWordVerify.Content, index: number) =>
        pageInfo?.pageSize * (pageInfo?.pageIndex - 1) + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'orgName',// ⭐调整
      isEllipsis: true,
      width: 300,
    },
    {
      title: '留言内容',
      dataIndex: 'orgName',// ⭐调整
      isEllipsis: true,
      width: 300,
    },
    {
      title: '留言时间',
      dataIndex: 'orgName',// ⭐调整
      isEllipsis: true,
      width: 300,
    },
    {
      title: '所属板块',
      dataIndex: 'orgName',// ⭐调整
      isEllipsis: true,
      width: 300,
    },
    {
      title: '审核状态',
      dataIndex: 'state',// ⭐调整
      width: 150,
      render: (_: string) => 
      Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '--',
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option', // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
      render: (_: any, _record: LeaveWordVerify.Content) => {
        return (
          <div>
            <Button 
              type="link"
              onClick={() => {
                history.push(`${routeName.LEAVE_WORD_VERIFY_DETAIL}?id=${_record.id}`);
              }}
            >
              {_record?.state === 'UN_CHECK' ? '审核' : '详情'} 
            </Button>
          </div>
        )
      }
    }
  ]

  const getLeaveWordVerifyPage = async (orgName = '', pageSize = 10, pageIndex = 1) => {
    try {
      setLoading(true)
      // const { result, code, totalCount, pageTotal } = await getLeaveWordVerifyPage({
      //   pageIndex,
      //   pageSize,
      // })
      // if (code === 0) {

      // } else {
        // message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  const searchList = [
    {
      key: 'orgName', // ⭐需要调整
      label: '用户名',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'orgName', // ⭐需要调整
      label: '留言内容',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'orgName', // ⭐需要调整
      label: '留言时间',
      type: Common.SearchItemControlEnum.INPUT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'orgName', // ⭐需要调整
      label: '审核状态',
      type: Common.SearchItemControlEnum.SELECT,
      initialValue: '',
      allowClear: true,
    },
    {
      key: 'orgName', // ⭐需要调整
      label: '所属板块',
      type: Common.SearchItemControlEnum.SELECT,
      initialValue: '',
      allowClear: true,
    },
  ];

  const onSearch = (info: any) => {
    const { orgName } = info || {};
    setPageInfo({ ...pageInfo, pageIndex: 1 });
    setOrgName(orgName);
    getLeaveWordVerifyPage(orgName, pageInfo?.pageSize);
  };

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('search-container')}>
        <SearchBar form={form} searchList={searchList} onSearch={onSearch} />
      </div>
      <div className={sc('table-container')}>
      <SelfTable
          rowKey="id"
          bordered
          scroll={{ x: 1200 }}
          columns={columns}
          loading={loading}
          dataSource={dataSource}
          pagination={{
            total: pageInfo?.totalCount,
            current: pageInfo?.pageIndex,
            pageSize: pageInfo?.pageSize,
            showTotal: (total: number) => (
              <div className="pagination-text">{`共${total}条记录 第${pageInfo?.pageIndex}/${pageInfo?.pageTotal || 1
                }页`}</div>
            ),
          }}
          onChange={(pagination: any) => {
            // ⭐ 也需要处理
            getLeaveWordVerifyPage(orgName, pagination.pageSize, pagination.current);
          }}
        />
      </div>
    </PageContainer>
  )
}