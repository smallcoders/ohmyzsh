import {
  Button,
  Form,
  Row,
  Col,
  message as antdMessage,
  Input,
  TreeSelect,
  Select
} from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { DownloadOutlined } from "@ant-design/icons";
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import type Common from '@/types/common';
import { Access, useAccess } from 'umi';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { getDetailList, exportDetailTable } from '@/services/demand-reports';
import { getAhArea } from '@/services/area';
import DockingManage from '@/types/docking-manage.d';
const sc = scopedClasses('tab-menu-demand-report-details');


export default () => {

  const [searchContent, setSearChContent] = useState({});

  // 需求地区集合
  const [area, setArea] = useState<any[]>([]);
  // 是否在下载中
  const [downloading, setDownloading] = useState<boolean>(false);
  // 头部数据
  const [headerData, setHeaderData] = useState<any[]>([]);

  // 表单配置
  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  // 需求状态
  const stateObj3 = {
    NEW_DEMAND: '新发布',
    CLAIMED: '已认领',
    DISTRIBUTE: '已分发',
    CONNECTING: '对接中',
    FEEDBACK: '已反馈',
    EVALUATED: '已评价',
    FINISHED: '已结束',
  };

  // 表格数据
  const [dataSource, setDataSource] = useState<any[]>([]);
  // 动态头部
  const [columns, setColumns] = useState<any[]>([]);


  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  const indexCol = {
    title: '序号',
    width: 80,
    dataIndex: 'sort',
    fixed: true,
    render: (_: any, _record: any, index: number) =>
      pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1
  }

  // 头部组
  const headerGroup = {
    name: {
      title: '需求名称',
      dataIndex: 'name',
      isEllipsis: true,
      fixed: true,
      width: 200,
      render: (_: string, _record: any) => (
        <a
          onClick={() => {
            window.open(`${routeName.DEMAND_MANAGEMENT_DETAIL}?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
    },
    area: {
      title: '需求地区',
      dataIndex: 'area',
      isEllipsis: true,
      render: (item?: string) => item ? item.split(',').join('、') : '--',
      width: 150,
    },
    status: {
      title: '需求状态',
      dataIndex: 'status',
      isEllipsis: true,
      // render: (_: string) => DockingManage.demandType[_],
      width: 150,
    }
  }
  const defaultHeader = [
    {
        field: "name",
        title: "需求名称"
    },
    {
        field: "area",
        title: "需求地区"
    },
    {
        field: "status",
        title: "需求状态"
    },
    {
        field: "userSubmitTime",
        title: "用户提交时间"
    },
    {
        field: "reportTime",
        title: "审核发布时间"
    },
    {
        field: "claimsTime",
        title: "认领时间"
    },
    {
        field: "awayTime",
        title: "分发时间"
    },
    {
        field: "feedbackTime",
        title: "反馈时间"
    },
    {
        field: "appraiseTime",
        title: "评价时间"
    },
    {
        field: "closeTime",
        title: "关闭时间"
    }
  ]

  // 头部处理
  const handleHeader = (header: any) => {
    const headerNew = header.map((item: any) => {
      const value = headerGroup[item.field]

      if (value) {
        return value
      }

      if (item.field.endsWith('Time')) {
        return {
          title: item.title,
          dataIndex: item.field,
          width: 200,
          render: (val?: string) => (val || '--')
        }
      }

      return {
        title: item.title,
        dataIndex: item.field,
        isEllipsis: true,
        width: 180,
        render: (_: string) => {
          if (!_) return '--'
          return <>
            <div>{_?.slice(0, 19) || ''}</div>
            <span className="followUp" data-time="">{_?.slice(20) || ''}</span>
          </>
        }
      }
    })
    return headerNew
  }


  /**
   * 获取数据列表
   * @param pageIndex
   * @param pageSize
   */
  const getDataList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code, message } = await getDetailList(Object.assign({
        pageIndex,
        pageSize,
      }, searchContent))
      const { data, header } = result
      if (code === 0) {
          setHeaderData(header || defaultHeader)
          setPageInfo({pageIndex: result.pageIndex, pageSize: result.pageSize, pageTotal: result.pageTotal, totalCount: result.totalCount});
          setDataSource(data || []);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  }

  useEffect(() => {
    if (headerData.length <= 0) return
    const {...rest} = indexCol;
    const headerNew = handleHeader(headerData);
    headerNew.unshift(rest);
    setColumns(headerNew);
  }, [pageInfo, headerData])


  const exportList = async () => {
    antdMessage.destroy()
    if (downloading) {
      antdMessage.warning('正在导出数据，请勿频繁操作');
      return
    }
    setDownloading(true)
    try {
      const res = await exportDetailTable(searchContent);
      if (res?.data.size == 51) return antdMessage.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = `供需对接明细表-${moment().format('YYYYMMDD')}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    } finally {
      const timer = setTimeout(() => {
        setDownloading(false)
        clearTimeout(timer)
      }, 2000)
    }
  };

  useEffect(() => {
    getAhArea().then((res) => {
      setArea(res)
    })
  }, [])

  useEffect(() => {
    getDataList()
  }, [searchContent]);

const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="demandName" label="需求名称" labelCol={{ flex: '90px' }}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="demandAreaCode" label="需求地区" labelCol={{ flex: '90px' }}>
                <TreeSelect
                  treeNodeFilterProp={'name'}
                  showSearch
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择"
                  allowClear
                  treeDefaultExpandAll
                  treeData={area}
                  fieldNames={{ children: 'nodes', value: 'code', label: 'name' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="demandState" label="需求状态" labelCol={{ flex: '90px' }}>
              <Select placeholder="请选择" allowClear>
                  {Object.entries(stateObj3).map((p) => {
                    return (
                      <Select.Option key={p[0]} value={p[0]}>
                        {p[1]}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{textAlign: 'right'}}>
              <div style={{paddingRight: '20px'}}>
                <Button
                  style={{ marginRight: 20 }}
                  type="primary"
                  key="search"
                  onClick={() => {
                    const search = searchForm.getFieldsValue();
                    console.log('search =>', search)
                    const { ...rest } = search;
                    console.log('rest =>', rest)
                    setSearChContent(rest);
                  }}
                >
                  查询
                </Button>
                <Button
                  type="primary"
                  key="primary2"
                  onClick={() => {
                    searchForm.resetFields();
                    setSearChContent({});
                  }}
                >
                  重置
                </Button>
              </div>
            </Col>
          </Row>
      </Form>
    </div>
  );
};

  const access = useAccess()



  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>供需对接明细表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access.PX_SD_MXB}>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={exportList}
            >
              导出数据
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey={'id'}
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getDataList,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
    </>
  );
};
