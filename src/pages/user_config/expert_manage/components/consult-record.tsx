import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Space,
  Popconfirm,
  Tooltip,
} from 'antd';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { EditTwoTone } from '@ant-design/icons';
import type ConsultRecord from '@/types/expert_manage/consult-record';
import {
  getConsultRecordPage,
  markConsultRecordContracted,
  updateConsultRecordRemark,
} from '@/services/expert_manage/consult-record';
import { UploadOutlined } from '@ant-design/icons';
import { expertConsultationExport } from '@/services/export';
import { Access, useAccess } from 'umi';
const sc = scopedClasses('user-config-logout-verify');
enum Edge {
  HOME = 0,
}

export default () => {
  const [dataSource, setDataSource] = useState<ConsultRecord.Content[]>([]);
  const [searchContent, setSearChContent] = useState<ConsultRecord.SearchBody>({});
  const [remark, setRemark] = useState<string>('');
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_ZJZX', // 专家管理-咨询记录
  }

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key]
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any)
        break
      }
    }
  },[])

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
    try {
      const { result, totalCount, pageTotal, code, message } = await getConsultRecordPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const mark = async (record: any) => {
    const tooltipMessage = '标记已联系';
    try {
      const markResult = await markConsultRecordContracted(record.id, remark);
      if (markResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        throw new Error(markResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const updRemark = async (record: any) => {
    const tooltipMessage = '修改';
    try {
      const markResult = await updateConsultRecordRemark(record.id, remark);
      if (markResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        throw new Error(markResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: ConsultRecord.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '企业/个人名称',
      dataIndex: 'orgName',
      width: 150,
      isEllipsis: true,
    },
    {
      title: '联系人',
      dataIndex: 'contactName',
      isEllipsis: true,
      width: 100,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      isEllipsis: true,
      width: 150,
    },
    {
      title: '咨询专家',
      dataIndex: 'expertName',
      isEllipsis: true,
      width: 150,
      render: (_: any, record: ConsultRecord.Content) => {
        return (
          <Tooltip
            title={
              <div
                style={{
                  display: 'grid',
                  color: '#000',
                  padding: 10,
                }}
              >
                <span>联系电话：{record?.expertPhone}</span>
                <span>工作单位：{record?.expertWorkUnit}</span>
              </div>
            }
            color={'#fff'}
          >
            <a>{_}</a>
          </Tooltip>
        );
      },
    },
    {
      title: '咨询内容',
      dataIndex: 'content',
      isEllipsis: true,
      width: 250,
    },
    {
      title: '咨询时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => moment(_).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '联系情况',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "U")]
        return !record.contacted ? (
          <div style={{ textAlign: 'center' }}>
            <Access accessible={accessible}>
              <Space size={20}>
                <Popconfirm
                  icon={null}
                  title={
                    <>
                      <Input.TextArea
                        placeholder="可在此填写备注内容，备注非必填"
                        onChange={(e) => setRemark(e.target.value)}
                        value={remark}
                        showCount
                        maxLength={100}
                      />
                    </>
                  }
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => mark(record)}
                >
                  <Button
                    type="link"
                    onClick={() => {
                      setRemark(record.remark || '');
                    }}
                  >
                    标记已联系
                  </Button>
                </Popconfirm>
              </Space>
            </Access>
          </div>
        ) : (
          <div style={{ display: 'grid', justifyItems: 'center' }}>
            <span>
              {record.operateTime ? moment(record.operateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
            </span>
            <span>操作人：{record.operatorName}</span>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="orgName" label="企业/个人名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="expertName" label="专家姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="contacted" label="联系情况">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={1}>待联系</Select.Option>
                  <Select.Option value={2}>已联系</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item name="time" label="咨询时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col offset={12} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.startCreateTime = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.endCreateTime = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  if (search.contacted) {
                    search.contacted = !!(search.contacted - 1);
                  }
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

  const exportList = async () => {
    console.log('咨询记录', searchContent);
    const { orgName, expertName, startCreateTime, endCreateTime, contacted } = searchContent;
    try {
      const res = await expertConsultationExport({
        orgName,
        expertName,
        startCreateTime,
        endCreateTime,
        contacted,
      });
      if (res?.data.size == 51) return antdMessage.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.ms-excel;charset=utf-8"});
      const fileName = '咨询记录.xlsx'
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

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>咨询记录列表(共{pageInfo.totalCount || 0}个)</span>
          <Access accessible={access['PX_UM_ZJZX']}>
            <Button icon={<UploadOutlined />} onClick={exportList}>
              导出
            </Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1280 }}
          columns={columns}
          expandable={{
            expandedRowRender: (record: ConsultRecord.Content) => (
              <p style={{ margin: 0 }}>
                备注：{record.remark}
                {record.editing && (
                  <Popconfirm
                    icon={null}
                    title={
                      <>
                        <Input.TextArea
                          placeholder="可在此填写备注内容，备注非必填"
                          onChange={(e) => setRemark(e.target.value)}
                          value={remark}
                          showCount
                          maxLength={100}
                        />
                      </>
                    }
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updRemark(record)}
                  >
                    <EditTwoTone
                      onClick={() => {
                        setRemark(record.remark || '');
                      }}
                    />
                  </Popconfirm>
                )}
              </p>
            ),
            // rowExpandable: () => true,
            expandIcon: () => <></>,
            defaultExpandAllRows: true,
            expandedRowKeys: dataSource.map((p) => p.id),
          }}
          rowKey={'id'}
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
    </>
  );
};
