import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Radio, DatePicker,
  Cascader
} from 'antd';
import SelfTable from '@/components/self_table';
import UploadModal from './components/uploadModal';
import { getAreaCode } from '@/services/business-channel';
import AddBusinessModal from './components/addBusinessModal'
import AuditModal from './components/auditModal'
import { useAccess, Access } from '@@/plugin-access/access';
import moment from 'moment';
import Common from '@/types/common';
const sc = scopedClasses('business-channel-manage');

const tableOptions = [
  {
    label: '商机录入',
    value: 0,
  },
  {
    label: '商机审核',
    value: 1,
  },
  {
    label: '商机分发',
    value: 2,
  },
]

export default () => {
  // 拿到当前角色的access权限兑现
  const access = useAccess();
  const [activeTab, setActiveTab] = useState<number>(0)
  const [searchForm] = Form.useForm()
  const uploadModalRef = useRef<any>(null)
  const addBusinessModalRef = useRef<any>(null)
  const AuditModalRef = useRef<any>(null)
  const [areaOptions, setAreaOptions] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });


  const recordColumns = [
    {
      title: '商机编号',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机名称',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机类型',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机状态',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '企业所属地区',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '操作时间',
      dataIndex: 'creatTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access['PU_BLAM_QJXFGG']}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  console.log(record)
                }}
              >
                编辑
              </Button>
            </Access>
          </>
        )
      },
    },
  ]

  const auditColumns = [
    {
      title: '商机编号',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机名称',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机来源',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机类型',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '关联企业',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '审核类型',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '提交时间',
      dataIndex: 'creatTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access['PU_BLAM_QJXFGG']}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  console.log(record)
                }}
              >
                审核
              </Button>
            </Access>
          </>
        )
      },
    },
  ]

  const distributeColumns = [
    {
      title: '商机编号',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机名称',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机来源',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '商机类型',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '关联企业',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '企业所属地区',
      dataIndex: 'advertiseName',
      width: 150,
      render: (advertiseName: string) => {
        return <span>{advertiseName || '--'}</span>
      }
    },
    {
      title: '审核时间',
      dataIndex: 'creatTime',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access['PU_BLAM_QJXFGG']}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  console.log(record)
                }}
              >
                分发
              </Button>
            </Access>
          </>
        )
      },
    },
  ]
  useEffect(() => {
    getAreaCode({parentCode: 340000}).then((res: any) => {
      console.log(res, '00000')
      if (res.code === 0){
        setAreaOptions(res.result)
      }
    })
  }, [])

  const getPage = async () => {
    setLoading(true)
    console.log(1)
  };

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    if (search.updateTime) {
      search.updateTimeStart = moment(search.updateTime[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss');
      search.updateTimeEnd = moment(search.updateTime[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss');
    }
    if (search.state){
      search.state = search.state * 1
    }
    delete search.updateTime;
    return search;
  };

  const useSearchNode = (): React.ReactNode => {
    const timeLabel = activeTab === 0 ? '发布时间' : '提交时间'
    return (
      <div className={sc('container-search')}>
        <Form form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item labelCol={{span: 8}} name="advertiseName" label="商机编号">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item labelCol={{span: 8}} name="advertiseName" label="企业名称">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
            </Col>
            {
              activeTab !== 2 &&
              <Col span={7}>
                <Form.Item labelCol={{span: 8}} name="updateTime" label={timeLabel}>
                  <DatePicker.RangePicker
                    allowClear
                    disabledDate={(current) => {
                      return current > moment().endOf('day');
                    }}
                  />
                </Form.Item>
              </Col>
            }
            {
              activeTab === 2 && areaOptions.length &&
              <Col span={7}>
                <Form.Item
                  name="area"
                  label="企业所属地"
                  labelCol={{ span: 8 }}
                >
                  <Cascader allowClear fieldNames={{ label: 'name', value: 'code', children: 'childList' }} placeholder="请选择" options={areaOptions} />
                </Form.Item>
              </Col>
            }
            <Col span={5} offset={1}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  console.log(search)
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
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
      <div className="table-box">
        <Radio.Group
          onChange={(e) => {
            setActiveTab(e.target.value)
          }}
          value={activeTab}
          options={tableOptions}
          optionType="button"
          buttonStyle="solid"
        />
      </div>
      {useSearchNode()}
      <div className="main-content">
        <div className="top-area">
          <div className="left-title">
            {
              activeTab === 0 ? '我的全部' : activeTab === 1 ? '全部待审核' : '全部待分发'
            }
          </div>
          {
            activeTab === 0 &&
            <div className="button-box">
              <Access accessible={access['P_BLM_XHXXPZ']}>
                <Button
                  style={{ marginRight: '20px' }}
                  type="default"
                  key="addStyle"
                  onClick={() => {
                    uploadModalRef.current.openModal()
                  }}
                >
                  导入商机
                </Button>
              </Access>
              <Access accessible={access['P_BLM_XHXXPZ']}>
                <Button
                  style={{ marginLeft: '10px' }}
                  type="primary"
                  key="addStyle"
                  onClick={() => {
                    // addBusinessModalRef.current.openModal()
                    AuditModalRef.current.openModal()
                  }}
                >
                  +新增
                </Button>
              </Access>
            </div>
          }
        </div>
        <SelfTable
          bordered
          loading={loading}
          columns={activeTab === 0 ? recordColumns : activeTab === 1 ? auditColumns : distributeColumns}
          dataSource={[]}
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
      <UploadModal ref={uploadModalRef} />
      <AddBusinessModal ref={addBusinessModalRef}/>
      <AuditModal ref={AuditModalRef}></AuditModal>
    </PageContainer>
  );
};
