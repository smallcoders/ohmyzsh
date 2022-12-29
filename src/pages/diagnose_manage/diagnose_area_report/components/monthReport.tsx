import {
    Button,
    Form,
    Row,
    Col,
    message,
    DatePicker,
    TreeSelect
  } from 'antd';
  
  import { DownloadOutlined } from "@ant-design/icons";
  
//   
  import scopedClasses from '@/utils/scopedClasses';
  import React, { useEffect, useState } from 'react';
  import { listAllAreaCode } from '@/services/common';
  import type Common from '@/types/common';
  import { Access, useAccess } from 'umi';
  import SelfTable from '@/components/self_table';
  const sc = scopedClasses('report-day-and-month');
  import moment from 'moment';
  import { getReportAreaPage, exportAreaPage } from '@/services/diagnose-manage';
  
  export default () => {
  
    const [searchContent, setSearChContent] = useState<{
      year?: string;
      areaLevel?: number;
      orgProvinceCode?: 340000;
      orgCityCode?: number;
      orgCountyCode?: number;
    }>({
      year: moment(new Date()).format('yyyy')
    });
    const [area, setArea] = useState<any[]>([]);
    const [selectedArea, setSelectedArea] = useState<any[]>([]);
    const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
        pageIndex: 1,
        pageSize: 20,
        totalCount: 0,
        pageTotal: 0,
      });
  
    const [tableHeader, setTableHeader] = useState<any[]>([])
    const [tableItems, setTableItems] = useState<any[]>([])
  
    /**
     * 获取数据列表
     */
    const getDataList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
      try {
        const { result, code, totalCount, pageTotal } = await getReportAreaPage({
            ...searchContent,
            pageIndex,
            pageSize,
            type: 2
        });
        if (code === 0) {
          const { header, data } = result
          if(header && data) {
            setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
            formatColumns(header, data)
          }else {
            setTableHeader([])
            setTableItems([])
          }
        } else {
          message.error(`请求分页数据失败`);
        }
      } catch (error) {
        console.log(error);
      }
    }
  
    // 合并行单元格
    const onMergeCell = (_: any, index: number) => {
      // 从第0行数据开始，开始每 2 行只显示一行
      if (index % 2 === 0) {
        // 第0行（index = 0）或者第2的倍数行 ，合并2行内容
        return { rowSpan: 2 }
      } else {
        // 非2的倍数行被合并，返回 0
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
          case 'sort':
            item.className = 'gray-bg'
            break;
          case 'area':
            // 需求地区列
            item.width = 128
            item.align = 'center'
            item.fixed = 'left'
            item.className = 'gray-bg'
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

    useEffect(() => {
      getAreaData();
    }, []);

    const dealOption = (areas: any) => {
      let arr = areas.filter(item => item.code == '340000')[0]?.nodes || []
      console.log(arr)
      return arr
    }

    const getAreaData = async () => {
      try {
        const areaRes = await listAllAreaCode();
        setArea(dealOption(areaRes && areaRes.result) || [])
      } catch (error) {
        console.log(error);
        message.error('获取省市区数据出错');
      }
    };
    // 处理数据
    const flatTreeAndSetLevel = (tree:any) => {
      const list:any = []
      tree.forEach(item => {
        const o = JSON.parse(JSON.stringify(item))
        if(o.nodes) delete o.nodes
        list.push(o)
        if(item.nodes && item.nodes.length) {
          list.push(...flatTreeAndSetLevel(item.nodes))
        }
      })
      return list
    }
    const getParentAreas = (pid:number, list:any) => {
      const target = []
      const o = list.find(item => item.code == pid) || {}
      if(JSON.stringify(o) != '{}') {
        target.push(o)
      }
      if(o.parentCode) {
        target.push(...getParentAreas(o.parentCode, list))
      }
      return target
    }
    const selectArea = (value:any, node:any, exra:any) => {
      let arr = getParentAreas(value, flatTreeAndSetLevel(area))
      console.log(arr, '----->>>')
      setSelectedArea(arr)
    }
  
    const useSearchNode = (): React.ReactNode => {
      const [searchForm] = Form.useForm();
      return (
        <div className={sc('container-search')}>
          <Form
            form={searchForm}
            >
            <Row justify='space-between'>
              <Col span={6}>
                <Form.Item name="year" label="诊断年份">
                  <DatePicker  defaultValue={moment(new Date())} picker="year" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="areaCode" label="所属区域">
                  <TreeSelect
                    placeholder="请选择"
                    allowClear
                    showCheckedStrategy="SHOW_ALL"
                    onChange={(value: any, node: any, exra: any) => {
                      selectArea(value, node, exra);
                    }}
                    fieldNames={{ value: 'code', label: 'name', children: 'nodes' }}
                    treeData={area}
                  />
                </Form.Item>
              </Col>
              <Col span={4} offset={8}>
                <Button
                  style={{ marginRight: 20 }}
                  type="primary"
                  key="search"
                  onClick={() => {
                    const search = searchForm.getFieldsValue();
                    const params:any = {}
                    const year = search.year && moment(search.year).format('YYYY')
                    console.log(search)
                    if(year) {
                      params.year = year
                    }
                    if (selectedArea && selectedArea.length > 0) {
                      selectedArea.map((item: any) => {
                        // if (item.grade == 1) {
                        //   search.areaLevel = 3
                        //   search.orgProvinceCode = item.code;
                        // }
                        if (item.grade == 2) {
                          params.areaLevel = 2
                          params.orgCityCode = item.code;
                        }
                        if (item.grade == 3) {
                          params.areaLevel = 1
                          params.orgCountyCode = item.code;
                        }
                      });
                    }
                    console.log(params, '搜索条件');
                    setSearChContent(params);
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

    const exportList = async () => {
      const curTime = moment(new Date()).format('YYYYMMDD')
      const {year, areaLevel, orgProvinceCode, orgCityCode, orgCountyCode} = searchContent
      try {
        const res = await exportAreaPage({
          year,
          areaLevel,
          type: 2,
          orgProvinceCode, 
          orgCityCode, 
          orgCountyCode, 
          pageIndex: 1,
          pageSize: 1000
        });
        if (res?.data?.size == 51) return message.warning('操作太过频繁，请稍后再试')
        const content = res?.data;
        const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
        const fileName = `诊断区域报表-月报表-${curTime}.xlsx`
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url;
        link.setAttribute('download', fileName)
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.log(error);
      }
    };
  
    const access = useAccess()
  
    return (
      <>
        {useSearchNode()}
        <div className={sc('container-table-header')}>
          <div className="title">
            <h3>诊断区域报表<span>当前诊断区域统计范围只有安徽省内区县，安徽省外暂不做统计</span></h3>
            <Access accessible={access['PX_PM_TJ_HD']}>
              <Button
                icon={<DownloadOutlined />}
                type="primary"
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
  