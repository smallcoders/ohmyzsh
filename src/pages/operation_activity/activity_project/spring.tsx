import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message,
  Radio,
  Popconfirm,
  Tooltip,
  Table,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { Access, useAccess } from 'umi';

import type Common from '@/types/common';
import type ActivityProject from '@/types/activity-project';
import { exportNewYearPage, getNewYearPage, getOverviewe, signNewYesar } from '@/services/activity-project';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import { routeName } from '../../../../config/routes';

const sc = scopedClasses('service_config_activity_project');
const appEnum = {
  QYS: '契约锁', SZFW: '数字法务', XSL: '薪事力', QSM: '七色米', XFTJ: '讯飞听见', XFFQ: '讯飞飞签', QL: '轻流', CXY: '诚需猿', LYZD: '羚羊诊断', LYXWYD: '羚羊小微易贷', CPZLBZX: '产品质量保证险'
};
// const typeEnum = {
//   'PARTICIPATE': '参与总数', 'ASSIST': '成功助力总数', 'SIGN': '兑换成功总数'
// };

const registerSourceEnum = {
  WEB: 'web端注册',
  WECHAT: '微信小程序注册',
  APP: 'APP',
  OTHER: '其他终端',
  WST: '皖事通',
  WQT: '皖企通',
  IFLYTEK: '科大讯飞-注册局',
  TOPOLOGY: '拓普-注册局',
};

export default () => {
  const [dataSource, setDataSource] = useState<ActivityProject.Content[]>([]);
  const [exchange, setExchange] = useState(false);
  const [selectRows, setSelectRows] = useState<ActivityProject.Content>({});
  const [searchForm] = Form.useForm();
  // 拿到当前角色的access权限兑现
  const access = useAccess()

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    const search = searchForm.getFieldsValue();
    if (search.registerDate) {
      search.registerStartDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.registerEndDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete search.registerDate;
    }
    if (search.completeDate) {
      search.completeStartDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.completeEndDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete search.time;
    }
    try {
      const params = {
        pageIndex,
        pageSize,
        ...search,
      };

      const { result, totalCount, pageTotal, code } = await getNewYearPage(params);
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const exportExcel = async () => {
    const search = searchForm.getFieldsValue();
    if (search.registerDate) {
      search.registerStartDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.registerEndDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete search.registerDate;
    }
    if (search.completeDate) {
      search.completeStartDate = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.completeEndDate = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
      delete search.time;
    }
    try {
      const params = {
        ...search,
        pageSize: 12,
        pageIndex: 1
      };
      const res = await exportNewYearPage(params)
      const content = res?.data;
      const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8" });
      const fileName = '数据明细.xlsx'
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }

  }
  const [overviewData, setOverview] = useState<any>([])

  const getPriview = async () => {
    const { result } = await getOverviewe()
    setOverview(result)
  }

  const handleUpdateMark = async (record: any) => {
    try {
      const { id } = record;
      const params = {
        id,
        remark,
        sign: exchange
      };

      const { message: msg, code } = await signNewYesar(params);
      if (code === 0) {
        message.success('标注成功');
        getPage();
      } else {
        message.error(msg || `标注失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [remark, setRemark] = useState<string>('');

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '用户ID',
      width: 200,
      dataIndex: 'userId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 200,
      render: (_: string) => (
        <Tooltip placement="top" title={_}>
          <div className="name">{_}</div>
        </Tooltip>
      ),
    },
    {
      title: '手机号',
      width: 200,
      dataIndex: 'phone',
    },
    {
      title: '注册时间',
      width: 200,
      dataIndex: 'registerTime',
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '注册端',
      width: 200,
      dataIndex: 'registerSource',
      render: (_: string) => registerSourceEnum[_],

    },
    {
      title: '身份',
      width: 200,
      dataIndex: 'role',
    },
    {
      title: '所属组织',
      width: 200,
      dataIndex: 'orgName',
    },
    {
      title: '邀请人数',
      width: 200,
      dataIndex: 'assistCount',
    },
    {
      title: '完成状态',
      width: 200,
      dataIndex: 'completed',
      render: (_: boolean) => <span>{_ ? '已完成' : '未完成'}</span>,
    },
    {
      title: '完成时间',
      width: 200,
      dataIndex: 'completeTime',
    },
    {
      title: '应用名称',
      width: 200,
      dataIndex: 'appNames',
    },
    {
      title: '奖品兑换',
      dataIndex: 'sign',
      width: 200,
      render: (_: boolean) => <span>{_ ? '已兑换' : '未兑换'}</span>,
    },
    {
      title: '操作',
      width: 200,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                localStorage.setItem('spring_detail', JSON.stringify(record));
                window.open(routeName.ACTIVITY_PROJECT_NEWYEAR_DETAIL);
              }}
            >
              详情
            </Button>
            <Access accessible={access['P_OA_CJHD']}>
              <Popconfirm
                icon={null}
                title={
                  <div style={{ display: 'grid', gap: 10, marginBottom: 10 }}>
                    <span style={{ fontWeight: '500' }}>奖品兑换标注</span>
                    <Radio.Group
                      onChange={(e) => {
                        setExchange(e.target.value);
                      }}
                      value={exchange}
                    >
                      <Radio value={false}>未兑换</Radio>
                      <Radio value={true}>已兑换</Radio>
                    </Radio.Group>

                    <Input.TextArea
                      placeholder="可在此填写备注内容，备注非必填"
                      onChange={(e) => setRemark(e.target.value)}
                      value={remark}
                      showCount
                      maxLength={100}
                    />
                  </div>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => handleUpdateMark(record)}
              >
                <Button
                  type="link"
                  onClick={() => {
                    // setSelectRows(record);
                    setExchange(record.sign);

                    setRemark(record.remark || '');
                  }}
                >
                  标注
                </Button>
              </Popconfirm>
            </Access>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    getPriview()
    getPage();
  }, []);
  const [isMore, setIsMore] = useState<boolean>(false);

  const identityObj = {
    ORG_MEMBER: '组织其他成员', ORG_MANAGER: '组织管理员', EXPERT: '已认证专家', INDIVIDUAL: '普通用户'
  }

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            {isMore && (
              <>
                <Col span={8}>
                  <Form.Item name="registerDate" label="注册时间">
                    <DatePicker.RangePicker allowClear showTime />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="orgName" label="所属组织">
                    <Input placeholder="请输入" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="completed" label="完成状态">
                    <Select placeholder="请选择" allowClear>
                      <Select.Option value={true}>
                        完成助力
                      </Select.Option>
                      <Select.Option value={false}>
                        未完成助力
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="completeDate" label="完成时间">
                    <DatePicker.RangePicker allowClear showTime />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="identity" label="身份">
                    <Select placeholder="请选择" allowClear>
                      {Object.entries(identityObj).map((p) => {
                        return (
                          <Select.Option key={p[0]} value={p[0]}>
                            {p[1]}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
              </>
            )}
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  getPage();
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  getPage();
                }}
              >
                重置
              </Button>

              <Button
                style={{ marginRight: 10 }}
                type="link"
                onClick={() => {
                  setIsMore(!isMore);
                }}
              >
                {isMore ? '收起' : '展开筛选'}
                {isMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  };

  return (
    <>
      <div className={sc('container-table-header')} style={{ marginBottom: 20 }}>
        <div className="title" style={{ marginBottom: 20 }}>
          <span>数据概览</span>
        </div>
        <div className={sc('container-table-body')}>
          <div className="overTable" style={{ display: 'flex' }}>
            <div style={{ display: 'grid' }}>
              <div className="overTable-cell" style={{ borderTop: '1px solid #ccc' }}>{'  '}</div>
              <div className="overTable-cell black">
                参与总数
              </div>
              <div className="overTable-cell black">
                成功助力总数
              </div>
              <div className="overTable-cell black">
                兑换成功总数
              </div>
            </div>
            {
              overviewData?.map(p => {
                return <div style={{ display: 'grid' }}>
                  <div className="overTable-cell black" style={{ borderTop: '1px solid #ccc' }}>{appEnum[p?.appEnum]}</div>
                  {
                    p?.statisticsData?.map(i => {
                      return <div className="overTable-cell">
                        {i.count}
                      </div>
                    })
                  }
                </div>
              })
            }
          </div>
        </div>
      </div>


      <div className={sc('container-table-header')}>
        <div className="title">
          数据明细
        </div>
        <div>
          {useSearchNode()}
          <Button onClick={() => { exportExcel() }}>导出</Button>
        </div>
      </div>



      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 2680 }}
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
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
    </>
  );
};
