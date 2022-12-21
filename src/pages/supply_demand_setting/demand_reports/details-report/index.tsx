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
import { DownloadOutlined } from "@ant-design/icons";
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import type Common from '@/types/common';
import { Access, useAccess } from 'umi';
import SelfTable from '@/components/self_table';
import { getDetailList } from '@/services/demand-reports';
import { getAhArea } from '@/services/area';
import DockingManage from '@/types/docking-manage.d';
const sc = scopedClasses('tab-menu-demand-report-details');



export default () => {

  const [searchContent, setSearChContent] = useState<{
    time?: string;
  }>({});
  // 需求地区集合
  const [area, setArea] = useState<any[]>([]);

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
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
    width: 50,
    render: (_: any, _record: any, index: number) =>
      pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1
  }

  const otherGroup = {
    name: {
    }
  }



  /**
   * 获取数据列表
   * @param pageIndex
   * @param pageSize
   */
  const getDataList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {

    try {
      // 模拟走接口
      const totalCount = 1, pageTotal = 1
      setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      const { result: {data, header}, code, message } = await getDetailList()
      console.log('result =>', data)

      if (code === 0) {
        const headerNew = header.map((item: any) => {
          return {
            title: item.title,
            dataIndex: item.field,
            width: 100
          }
        })
        headerNew.unshift(indexCol)
        setColumns(headerNew);
        setDataSource(data);
        console.log(headerNew, data)

      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };



  useEffect(() => {
    getAhArea().then((res) => {
      console.log('res =>', res)
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
            <Col span={8}>
              <Form.Item name="name" label="需求名称" labelCol={{ flex: '90px' }}>
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="area" label="需求地区" labelCol={{ flex: '90px' }}>
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
            <Col span={8}>
              <Form.Item name="status" label="需求状态" labelCol={{ flex: '90px' }}>
              <Select placeholder="请选择" allowClear>
                  {
                    Object.entries(DockingManage.demandType)?.filter(p => p[0] != '3').map(p => {
                      return <Select.Option value={p[0]}>{p[1]}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} offset={16} style={{textAlign: 'right'}}>
              <div className="ant-col-16" style={{marginLeft: '90px'}}>
                <Button
                  style={{ marginRight: 20 }}
                  type="primary"
                  key="search"
                  onClick={() => {
                    const search = searchForm.getFieldsValue();
                    const { ...rest } = search;
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
          <Access accessible={access.PX_PM_TJ_HD}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
              }}
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
