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

export default () => {

  const [totalCount, setTotalCount] = useState<number>(0)

  const [searchContent, setSearChContent] = useState<{
    time?: string;
  }>({});

  const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const [tableHeader, setTableHeader] = useState<any[]>([])
  const [tableItems, setTableItems] = useState<any[]>([])

  // /**
  //  * 获取数据列表
  //  * @param pageIndex
  //  * @param pageSize
  //  */
  const getDataList = async () => {
    try {
      // 模拟走接口
      const tableHeader: any = [
        { title: '需求地区', dataIndex: 'city' },
        { title: '统计维度', dataIndex: 'range' },
        { title: '1030～1105', dataIndex: '1030～1105' },
        { title: '1006～1112', dataIndex: '1006～1112' },
      ]
      const tableItems: any = [
        { city: '合肥', range: '新增需求数', '1030～1105': 98 , '1006～1112': 1 },
        { city: '合肥', range: '新增对接需求数', '1030～1105': 23, '1006～1112': 2 },
        { city: '合肥', range: '新增跟进次数', '1030～1105': 98, '1006～1112': 3 },
        { city: '淮南', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 4 },
        { city: '淮南', range: '新增跟进次数', '1030～1105': 98, '1006～1112': 5 },
        { city: '淮南', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 6 },
        { city: '六安', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 4 },
        { city: '六安', range: '新增跟进次数', '1030～1105': 98, '1006～1112': 5 },
        { city: '六安', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 6 },
        { city: '蚌埠', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 4 },
        { city: '蚌埠', range: '新增跟进次数', '1030～1105': 98, '1006～1112': 5 },
        { city: '蚌埠', range: '新增跟进次数', '1030～1105': 23, '1006～1112': 6 }
      ]

      // 插入序号      
      tableHeader.splice(0, 0, {
        title: '序号',
        dataIndex: 'sort',
        fixed: 'left',
        onCell: (_: any, index: number) => {
          // 从第0行数据开始，开始每 3 行只显示一行
          if (index % 3 === 0) {
            // 第0行（index = 0）或者第3的倍数行 ，合并3行内容
            return { rowSpan: 3 }
          } else {
            // 非3的倍数行被合并，返回 0
            return { rowSpan: 0 }
          }
        },
        width: 65,
        render: (_: any, _record: any, index: number) => (Math.floor(index / 3)) + 1
      })


      for (let i = 0, l = tableHeader.length; i < l; i++) {
        const item = tableHeader[i]
        switch (item.dataIndex) {
          case 'city':
            item.width = 90
            item.align = 'center'
            item.fixed = 'left'
            // 合并行单元格
            item.onCell = (_: any, index: number) => {
              // 从第0行数据开始，开始每 3 行只显示一行
              if (index % 3 === 0) {
                // 第0行（index = 0）或者第3的倍数行 ，合并3行内容
                return { rowSpan: 3 }
              } else {
                // 非3的倍数行被合并，返回 0
                return { rowSpan: 0 }
              }
            }
            break;
          case 'range':
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
            item.align = 'center'
            break
        }
      }

      for (let i = 0, l = tableItems.length; i < l; i++) {
        tableItems[i].id = i
      }
      
      setTableHeader(tableHeader)
      setTableItems(tableItems)
      // 这样走接口
      // const { result, totalCount, pageTotal, code } = await getActivityList({
      //   pageIndex,
      //   pageSize,
      //   ...searchContent,
      // });
      // if (code === 0) {
      //   setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
      //   setDataSource(result);
      // } else {
      //   message.error(`请求分页数据失败`);
      // }
    } catch (error) {
      console.log(error);
    }
  }

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
              <Form.Item name="time" label="统计月份">
                <DatePicker picker="month" />
              </Form.Item>
            </Col>
            <Col span={4} offset={14}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const time = search.time && moment(search.time).format('YYYY-MM')
                  setSearChContent({ time });
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setSearChContent({});
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
          <span>各地市供需对接新增数据周报表(共{totalCount || 0}个)</span>
          <Access accessible={access['PX_PM_TJ_HD']}>
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
