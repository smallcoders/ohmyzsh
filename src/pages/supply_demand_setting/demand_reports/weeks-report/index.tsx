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
const sc = scopedClasses('tab-menu-demand-report-weeks');
import moment from 'moment';
import { getDemandReportsWeaksList, exportWeaksTable } from '@/services/demand-reports';

export default () => {

  const [searchContent, setSearChContent] = useState<{
    month?: string;
  }>({
    month: moment(new Date()).format('yyyy-MM')
  });

  // 是否在下载中
  const [downloading, setDownloading] = useState<boolean>(false);

  const [tableHeader, setTableHeader] = useState<any[]>([])
  const [tableItems, setTableItems] = useState<any[]>([])

  /**
   * 获取数据列表
   */
  const getDataList = async () => {
    try {
      const { result, code } = await getDemandReportsWeaksList({
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
          initialValues={{
            month: moment(new Date())
          }}
          >
          <Row justify='space-between'>
            <Col>
              <Form.Item name="month" label="统计月份">
                <DatePicker picker="month" clearIcon={false} />
              </Form.Item>
            </Col>
            <Col>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const month = (search.month && moment(search.month).format('yyyy-MM')) || moment(new Date()).format('yyyy-MM')
                  setSearChContent({ month });
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({ month: moment(new Date()).format('yyyy-MM') });
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

  const exportList = async () => {
    message.destroy()
    if (downloading) {
      message.warning('正在导出数据，请勿频繁操作');
      return;
    }
    setDownloading(true)
    try {
      const res = await exportWeaksTable({
        ...searchContent
      });
      if (res?.data.size == 51) return message.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = `各地市供需对接新增数据周报表-${moment().format('YYYYMMDD')}.xlsx`;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      message.error(`请求失败，原因:{${error}}`);
    } finally {
      setTimeout(() => {
        setDownloading(false)
      }, 2000)
    }
  };

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>各地市供需对接新增数据周报表</span>
          <Access accessible={access['PX_SD_ZBB']}>
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
          columns={tableHeader}
          dataSource={tableItems}
          pagination={false}
        />
      </div>
    </>
  );
};
