import {
  Button,
  Form,
  Row,
  Col,
  message,
  DatePicker,
} from 'antd';

import { DownloadOutlined } from "@ant-design/icons";

import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { Access, useAccess } from 'umi';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('tab-menu-demand-report-month');
import moment from 'moment';
import { getDemandReportsMonthList } from '@/services/demand-reports';

export default () => {

  const [searchContent, setSearChContent] = useState<{
    year?: string;
  }>({
    year: moment(new Date()).format('yyyy')
  });

  const [tableHeader, setTableHeader] = useState<any[]>([])
  const [tableItems, setTableItems] = useState<any[]>([])

  /**
   * 获取数据列表
   */
  const getDataList = async () => {
    try {
      const { result, code } = await getDemandReportsMonthList({
        ...searchContent,
      });
      if (code === 0) {
        const { reportHead, reportData } = result
        formatColumns(reportHead, reportData)
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 合并行单元格
  const onMergeCell = (_: any, index: number) => {
    // 从第0行数据开始，开始每 3 行只显示一行
    if (index % 3 === 0) {
      // 第0行（index = 0）或者第3的倍数行 ，合并3行内容
      return { rowSpan: 3 }
    } else {
      // 非3的倍数行被合并，返回 0
      return { rowSpan: 0 }
    }
  }

  // 表头和内容数据的处理
  function formatColumns(tableHeader: any[], tableItems: any[]) {
    // 插入序号, 合并序号列的单元格
    tableHeader.splice(0, 0, {
      title: '序号',
      dataIndex: 'sort',
      fixed: 'left',
      onCell: onMergeCell,
      width: 65,
      render: (_: any, _record: any, index: number) => (Math.floor(index / 3)) + 1
    })

    // 动态表头处理
    for (let i = 0, l = tableHeader.length; i < l; i++) {
      const item = tableHeader[i]
      switch (item.dataIndex) {
        case 'city':
          // 需求地区列
          item.width = 90
          item.align = 'center'
          item.fixed = 'left'
          // 合并行单元格
          item.onCell = onMergeCell
          break;
        case 'range':
          // 维度/日期列
          item.title = (
            <div className='headerCell'>
              <div className='top'>日期</div>
              <div className='bottom'>统计维度</div>
            </div>
          )
          item.align = 'center'
          item.fixed = 'left'
          item.width = 135
          break
        default:
          // 其他
          item.align = 'center'
          break
      }
    }

    // 设置数据为一id
    for (let i = 0, l = tableItems.length; i < l; i++) {
      tableItems[i].id = i
    }

    setTableHeader(tableHeader)
    setTableItems(tableItems)
  }

  useEffect(() => {
    getDataList()
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form
          form={searchForm}
          >
          <Row justify='space-between'>
            <Col>
              <Form.Item name="year" label="统计年份">
                <DatePicker  defaultValue={moment(new Date())} picker="year" />
              </Form.Item>
            </Col>
            <Col>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const year = search.year && moment(search.year).format('yyyy')
                  setSearChContent({ year });
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({ year: moment(new Date()).format('yyyy') });
                }}
              >
                重置
              </Button>
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
          <span>各地市供需对接新增数据月报表</span>
          <Access accessible={access['PX_SD_YBB']}>
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
          columns={tableHeader}
          dataSource={tableItems}
          pagination={false}
        />
      </div>
    </>
  );
};
