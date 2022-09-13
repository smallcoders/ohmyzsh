/* eslint-disable */
import { Table, message, Select } from 'antd';
const { Option } = Select;
import '../service-config-diagnose-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import { getOrgTypeList } from '@/services/diagnose-manage';
import { history } from 'umi';

const sc = scopedClasses('service-config-diagnose-manage');

const Introduce: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });
  /**
   * 获取数据栏
   */
  const getDataColumns = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      let {result, code, totalCount, pageTotal} = await getOrgTypeList({state: 0,pageIndex,pageSize});
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setData(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDataColumns()
  }, []);

  // 查看历史版本
  const toVersion = async (value: any, record: any) => {
    history.push((`/service-config/diagnose/history?version=${value}&firstQuestionnaireNo=${record?.firstQuestionnaireNo}`))
  }
  /**
   * column
   */
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '诊断名称',
      dataIndex: 'name',
      editable: true,
      width: 150,
    },
    {
      title: '下架时间',
      dataIndex: 'stopTime',
      editable: true,
      width: 150,
    },
    {
      title: '最新版本号',
      dataIndex: 'latestVersion',
      editable: true,
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'option',
      width: 140,
      render: (_: any, record: any) => {
        return (
          <Select defaultValue="查看历史版本" style={{ width: 120 }} bordered={false}
            onChange={(e) => toVersion(e, record)}
          >
            {record.allVersion && record.allVersion.map(item => {
                return (
                  <Option value={item}>{item}</Option>
                )
              })}
          </Select>
        );
      },
    },
  ];

  return (
    <div className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>企业诊断列表</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <Table scroll={{ x: 1080 }} 
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDataColumns,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
          columns={columns} 
          bordered 
          dataSource={data} 
        />
      </div>
    </div>
  );
};

export default Introduce;
