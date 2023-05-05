import {Button, Select, Row,Tag, Col, Form, Input, Popconfirm, message, message as antdMessage} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import React, {useEffect, useState} from 'react';
import SelfTable from '@/components/self_table';
import { history, Access, useAccess } from 'umi';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { routeName } from '../../../../config/routes';
import {updateConversion} from "@/services/achievements-manage";
import {updateLabel} from "@/services/purchase";
import {
  getAdvertiseDiffTypeNum,
  getAdvertiseList,
  getAllLayout,
} from "@/services/baseline";
import Common from "@/types/common";
import moment from "moment/moment";

const sc = scopedClasses('content-stream-ad');
export default () => {
  const [staNumArr, setStaNumArr] = useState<any>([]);

const handleAdd = (item:any) => {
  if(item){
    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}?id=${item}`);
  }else{
    history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}`);

  }
};
const handleDetail = (item:any) => {
  history.push(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_DETAIL}?id=${item}`);
};
const handleStatisticalDetail = (item: any) => {
  history.push(
    `${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_STATISTICAL_DETAIL}?articleTypeId=${item?.articleTypeId}&typeName=${item?.typeName}`,
  );
};
// 统计卡片
const StaCard = () => {
  return (
    <div className={sc('card')}>
      {staNumArr.map((item:any) => {
        return (
          <div
            className="wrap"
            key={item.title}
            onClick={() => handleStatisticalDetail(item)}
          >
            <div className="title">{item.typeName} ></div>
            <div className="num">{item.number}</div>
          </div>
        );
      })}
    </div>
  );
};

const formLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};



  const [layType, setLayType] = useState<any>([]);
  const statusMap = {
    1: '上架',
    3: '下架',
    0: '暂存'
  }
  // 拿到当前角色的access权限兑现
  const access = useAccess();
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [visible, setVisible] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [searchForm] = Form.useForm();

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getAdvertiseList({
        pageIndex,
        pageSize,
        advertiseType:'CONTENT_STREAM_ADS',
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result?.list);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      // antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 删除
  const remove = async (id: string) => {
    try {
      const removeRes = await updateLabel({id, state: 1, labelType: 0});
      if (removeRes.code === 0) {
        message.success(`删除成功`);
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const editState = async (id: string) => {
    try {
      const updateStateResult = await updateConversion(id);
      if (updateStateResult.code === 0) {
        message.success(`操作成功`);
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllLayout().then((res) => {
      if (res.code === 0 && res.result) {
        const labelArr = res.result.map((item: any) => {
          return {
            value: item.id,
            label: item.typeName,
          };
        });
        setLayType(labelArr);
      }
    });
    getAdvertiseDiffTypeNum().then((res) => {
      if (res.code === 0 && res.result) {
        setStaNumArr(res.result)
      }
    })
  }, []);
  useEffect(()=>{
    getPage()
  },[searchContent])
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="advertiseName" label="内容标题">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="articleTypeId" label="版面">
                <Select options={layType} mode={'multiple'} placeholder="请选择" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="status" label="状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>暂存</Select.Option>
                  <Select.Option value={1}>上架</Select.Option>
                  <Select.Option value={3}>下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: '20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '内容标题',
      dataIndex: 'advertiseName',
      width: 150,
      render: (title: string) => {
        return title || '--';
      },
    },
    {
      title: '图片',
      dataIndex: 'advertiseOssRelationList',
      isEllipsis: true,
      width: 200,
      render: (advertiseOssRelationList: any) => {
        return (
          <div className="img-tr">
            {
              advertiseOssRelationList.length ? advertiseOssRelationList?.map((item: any, index: number) => {
                return (
                  <div className="img-box">
                    <img src={item.ossUrl} key={index} alt='' />
                  </div>
                )
              }) : '--'
            }
          </div>
        )
      },
    },
    {
      title: '版面',
      dataIndex: 'advertiseArticleTypeRelationList',
      isEllipsis: true,
      width: 250,
      render: (advertiseArticleTypeRelationList:any) => {
        advertiseArticleTypeRelationList.length ? advertiseArticleTypeRelationList?.map((item: any, index: number) => {
          const arr: any = layType.filter((item1:any) => item1.value===item.id)
          return <span color="blue">{arr && arr.length > 0 ? arr[0].label : '--'}</span>
        }) : '--'
      },
    },
    {
      title: '位置',
      dataIndex: 'displayOrder',
      width: 150,
      render: (displayOrder:any) => {
        return <span>{displayOrder}</span>;
      },
    },
    {
      title: '作用范围',
      width: 150,
      dataIndex: 'scope',
      render: (scope: any) => {
        return (<>
          {scope==='ALL_USER'&&<span>全部用户</span>}
          {scope==='ALL_LOGIN_USER'&&<span>全部登陆用户</span>}
          {scope==='ALL_NOT_LOGIN_USER'&&<span>全部未登录用户</span>}
          {scope==='PORTION_USER'&&<span>部分用户</span>}
          {!scope&&<span>__</span>}
        </>)
      },
    },
    {
      title: '浏览次数',
      width: 200,
      dataIndex: 'browsedCount',
      sorter: (a: any, b: any) => a.browsedCount - b.browsedCount,
      render: (browsedCount: any) => {
        return <span>{browsedCount}</span>;
      },
    },
    {
      title: '被关闭次数',
      dataIndex: 'closeCount',
      width: 200,
      sorter: (a: any, b: any) => a.closeCount - b.closeCount,
      render: (closeCount: string) => {
        return <span>{closeCount || 0}</span>;
      },
    },
    {
      title: '曝光量',
      dataIndex: 'createByName',
      width: 200,
      sorter: (a: any, b: any) => a.createByName - b.createByName,
      render: (createByName: string) => {
        return <span>{createByName || 0}</span>;
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
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
      title: '状态',
      dataIndex: 'status',
      width: 200,
      render: (status: string) => {
        return (
          <>
            {statusMap[status] || '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => {
        if (record.crawered === 0) {
          return <span>--</span>;
        }
        return (
          <div style={{ whiteSpace: 'break-spaces' }}>
            <Access accessible={access.PD_BLM_SSRDGL}>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleDetail(record.id)
                }}
              >
                详情
              </Button>
              <Button
                size="small"
                type="link"
                onClick={() => {
                  handleAdd(record.id)
                }}
              >
                编辑
              </Button>
              <Popconfirm
                title="删除该内容流广告后，系统将不再推荐该广告，确定删除？"
                okText="删除"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
              <Button
                size="small"
                type="link"
                onClick={() => {
                  // handleDelete(record)
                }}
              >
                删除
              </Button>
              </Popconfirm>
              {record.state === 'ON_SHELF' && (
                <Popconfirm
                  title="确定将内容下架？"
                  okText="下架"
                  cancelText="取消"
                  onConfirm={() => editState(record.id as any, 0)}
                >
                  <Button type="link">下架</Button>
                </Popconfirm>
              )}
              {record.state === 'OFF_SHELF' && (
                <Popconfirm
                  title="确定将内容上架？"
                  okText="上架"
                  cancelText="取消"
                  onConfirm={() => editState(record.id as any, 1)}
                >
                  <Button type="link">上架</Button>
                </Popconfirm>
              )}

            </Access>
          </div>
        );
      },
    },
  ];
  return (
    <PageContainer className={sc('container')}>
      <StaCard />
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <Access accessible={access.PA_BLM_SSRDGL}>
          <Button
            type="primary"
            style={{ marginBottom: '10px' }}
            onClick={() => {
              window.open(`${routeName.BASELINE_OPERATIONS_MANAGEMENT_CONTENT_STREAM_AD_ADD}`);
              // modalForm.resetFields()
              // setVisible(true)
            }}
          >
            新增
          </Button>
        </Access>
        <SelfTable
          rowKey="id"
          loading={loading}
          bordered
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1000 }}
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
  );
};
