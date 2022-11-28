import {
  Button,
  Form,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import {
  getTemplateData,
  exportData,
} from '@/services/page-creat-manage'
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { history } from 'umi';
const sc = scopedClasses('page-creat-list');
export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [tableColumns, setTableColumns] = useState<any>([])
  const [isExporting, setIsExporting] = useState<boolean>(false)
  const id = history.location.query?.id as string;
  const tmpName = history.location.query?.tmpName as string;
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code, message } = await getTemplateData({
        pageIndex,
        pageSize,
        ...searchContent,
        tmpId: id
      });
      const { totalCount, pageTotal, data, columns} = result
      if (code === 0) {
        if (!tableColumns.length){
          const newColumns: any = [
            {
              title: '序号',
              dataIndex: 'sort',
              width: 80,
              render: (_: any, _record: any, index: number) =>
                pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
            },
            {
              title: '提交人',
              dataIndex: 'submit_user_name',
              isEllipsis: true,
              width: 200,
            },
          ];
          columns.forEach((item: {paramDesc: string, paramName: string}) => {
            const {paramName, paramDesc} = item
            if (['submit_user_id', 'submit_user_name', 'create_time'].indexOf(paramName) === -1){
               newColumns.push({
                 title: paramDesc,
                 dataIndex: paramName,
                 render: (text: string) => {
                   return(
                     <span>{text.split('&&@#@').join(';')}</span>
                   )
                 }
               })
            }
          })
          newColumns.push({
            title: '提交时间',
            dataIndex: 'create_time',
            width: 200,
            render: (creatTime: string) => {
              return (
                <>
                  {moment(creatTime).format('YYYY-MM-DD HH:mm:ss')}
                </>
              )
            },
          })
          setTableColumns(newColumns)
        }
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(data);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.creatTime) {
      search.createTimeStart = moment(search.creatTime[0]).format('YYYY-MM-DD HH:mm:ss');
      search.createTimeEnd = moment(search.creatTime[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    delete search.creatTime;
    return search;
  };
  useEffect(() => {
    getPage();
  }, [searchContent]);

  const exportDataClick = () => {
    if (isExporting){
      return
    }
    setIsExporting(true)
    exportData({tmpId: id,...getSearchQuery()}).then((res) => {
      setIsExporting(false)
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = `${tmpName}.xlsx`
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url;
      link.setAttribute('download', fileName)
      document.body.appendChild(link);
      link.click();
      return res
    }).catch(() => {
      setIsExporting(false)
    })
  }

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={7} offset={1}>
              <Form.Item name="creatTime" label="提交时间">
                <DatePicker.RangePicker
                  allowClear
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  setSearChContent(search);
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>{tmpName}</span>
          <Button
            type="primary"
            onClick={() => {
              exportDataClick()
            }}
          >
            导出数据
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        {
          tableColumns.length > 3 &&
          <SelfTable
            rowKey="id"
            bordered
            columns={tableColumns}
            dataSource={dataSource}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                  onChange: getPage,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
            }
          />
        }
      </div>
    </PageContainer>
  );
};
