import { PageContainer } from "@ant-design/pro-layout"
import scopedClasses from '@/utils/scopedClasses';
import { useState } from "react";
import {Button, Col,Tooltip, Form,DatePicker, Input, Row,  Space, Select,Modal} from "antd";
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';
const sc = scopedClasses('service-content-manage')
import moment from 'moment';
import './index.less'
import { routeName } from '../../../../config/routes';
import type Common from '@/types/common';
export default(()=>{
    const [loading,setLoading] = useState(false)
    const [searchContent, setSearChContent] = useState<any>({});
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [dataSource, setDataSource] = useState<any>([]);
    const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      pageTotal: 0,
    });
    const columns = [
      {
        title: '序号',
        dataIndex: 'sort',
        width: 80,
        render: (_: any, _record: any, index: number) =>
          pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
      },
      {
        title: '标题',
        dataIndex: 'title',
        render: (_: any, record: any) => <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span>
            {_}
          </span>
          {record?.isTop && <div style={{ background: '#169BD5', color: '#FFF', padding: '0 2px', borderRadius: '2px', whiteSpace: 'nowrap' }}>已置顶</div>}
          {record?.riskInfo && <Tooltip title={record?.riskInfo}><div style={{ background: '#D7001A', color: '#FFF', padding: '0 2px', borderRadius: '2px', whiteSpace: 'nowrap' }}>风险</div></Tooltip>}
        </div>,
        width: 300,
      },
      {
        title: '内容类型',
        dataIndex: 'types',
        render: (_: any[]) => _?.length > 0 ? _?.map(p => p.typeName).join(',') : '--',
        width: 200,
      },
      {
        title: '发布服务号',
        dataIndex: 'source',
        isEllipsis: true,
        render: (_: any[]) => _ || '--',
        width: 300,
      },
      {
        title: '发布时间',
        dataIndex: 'publishTime',
        isEllipsis: true,
        render: (_: string) => _ ? moment(_).format('YYYY-MM-DD HH:mm:ss') : '--',
        width: 250,
      },
      {
        title: '操作',
        width: 200,
        dataIndex: 'option',
        fixed: 'right',
        render: (_: any, record: any) => {
          // const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
          return (
            <Space wrap>
              {record?.status == 2 &&
                <>
                  <Access accessible={access['P_BLM_NRGL']}>
                    <Button
                      type="link"
                      style={{ padding: 0 }}
                      onClick={() => {
                        window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE + `?id=${record?.id}`);
                      }}
                    >
                      编辑
                    </Button>
                  </Access>
                </>
              }
              {record?.status == 1 &&
                <>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                    }}
                  >
                    通过
                  </Button>
                  <Access accessible={access['P_BLM_NRGL']}>
                    <Button
                      style={{ padding: 0 }}
                      type="link"
                      onClick={() => {
                        Modal.confirm({
                          title: '提示',
                          content: '确定将内容下架？',
                          okText: '下架'
                        })
                      }}
                    >
                      拒绝
                    </Button>
                  </Access>
                </>
              }
              {record?.status == 0 &&
                <>
                  <Button
                    style={{ padding: 0 }}
                    type="link"
                    onClick={() => {
                      window.open(routeName.BASELINE_CONTENT_MANAGE_DETAIL + `?id=${record?.id}`);
                    }}
                  >
                    详情
                  </Button>
  
                  {record?.auditCommon ? <Access accessible={access['P_BLM_NRGL']}><Button
                    type="link"
                    style={{ padding: 0 }}
                    onClick={() => {
                      Modal.confirm({
                        title: '提示',
                        content: '确定将内容上架？',
                        okText: '上架'
                      })
                    }}
                  >
                    上架
                  </Button></Access> : <>
                    <Access accessible={access['P_BLM_NRGL']}>
                        <Button
                        type="link"
                        style={{ padding: 0 }}
                        onClick={() => {
                          window.open(routeName.BASELINE_CONTENT_MANAGE_ADDORUPDATE + `?id=${record?.id}`);
                        }}
                      >
                        编辑
                      </Button>
                    </Access>
                  </>
                  }
                </>
              }
              {
                record?.status !== 1 &&
                <Access accessible={access['PD_BLM_NRGL']}>
                    <Button type="link" style={{ padding: 0, color: 'red' }} onClick={() => {
                        Modal.confirm({
                          title: '删除数据',
                          content: '删除该内容后，系统将不再推荐该内容，确定删除？',
                          okText: '删除'
                        })
                      }}>
                        删除
                    </Button>
                  </Access>
              }
            </Space>
            // </Access>
          )
  
  
        },
      },
    ].filter(p => p);
    const formLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
      };
      const [searchForm] = Form.useForm();

      // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="topic" label="标题">
                <Input placeholder="请输入" allowClear  autoComplete="off"/>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publicUserName" label="服务号名称">
                <Input placeholder="请输入" allowClear  autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enable" label="发布账号">
                <Select placeholder="请选择" allowClear >
                  <Select.Option value={0}>下架</Select.Option>
                  <Select.Option value={1}>上架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enable" label="时间范围">
              <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enable" label="内容类型">
                <Select placeholder="请选择" allowClear >
                  <Select.Option value={0}>图文</Select.Option>
                  <Select.Option value={1}>图片</Select.Option>
                  <Select.Option value={2}>下架</Select.Option>
                  <Select.Option value={3}>上架</Select.Option>
                  <Select.Option value={4}>下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4} offset={4}>
              <Button
                style={{ marginRight:'20px'}}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  search.startTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                  search.endTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  delete search.time;
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
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
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
   
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
    return(
        <PageContainer  className={sc('container')}>
              {useSearchNode()}
              <div className={sc('container-table-body')}>
              <div className={sc('container-table-header')}>
          <div>
            <Button
              type="default"
              key="pass"
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '确定批量通过同步至产业圈',
                  okText: '确定',
                  onOk: () => {
                    console.log('通过');
                  },
                })
              }}
            >
              批量通过
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="default"
              key="reject"
              onClick={() => {
                Modal.confirm({
                  title: '提示',
                  content: '确定批量拒绝同步至产业圈',
                  okText: '确定',
                  onOk: () => {
                    console.log('拒绝');
                    
                  },
                })
              }}
            >
              批量拒绝
            </Button>
          </div>
      </div>
              <SelfTable
          loading={loading}
          bordered
          scroll={{ x: 2580 }}
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange: onSelectChange,
          }}
          rowKey={'id'}
          columns={columns}
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
        </div>
        </PageContainer>
    )
})