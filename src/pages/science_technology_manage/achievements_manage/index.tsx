import { Button, Input, Form, Row, Col, message, Space, Popconfirm, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { request } from 'umi';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import React, { useEffect, useState, useRef } from 'react';
import type AchievementsTypes from '@/types/service-config-achievements-manage';
import { history, Access, useAccess } from 'umi';
import { getUrl } from '@/utils/util';
import scopedClasses from '@/utils/scopedClasses';
import { creativeAchievementExport } from '@/services/export';
const sc = scopedClasses('science-technology-manage-achievements-manage');
import {
  getKeywords, // 关键词枚举
  getCreativeTypes, // 应用行业
  updateKeyword, // 关键词编辑
  updateConversion, // 完成转化
} from '@/services/achievements-manage';
import './index.less';
const stateObj = {
  NOT_CONNECT: '未对接',
  CONNECTING: '对接中',
  CONVERTED: '已转化',
};
enum Edge {
  HOME = 0, // 新闻咨询首页
}
export default () => {
  const actionRef = useRef<ActionType>();
  const paginationRef = useRef<any>();
  const [total, setTotal] = useState<number>(0);
  const [typeOptions, setTypeOptions] = useState<any>({}); // 应用行业数据
  const [keywords, setKeywords] = useState<any[]>([]); // 关键词数据
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_SM_CGGL', // 科产管理-科技成果管理页面查询
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

  // 点击关键词编辑，记录当前编辑的id
  const [currentId, setCurrentId] = useState<string>('');
  const formLayout = {
    labelCol: { span: 3 },
    wrapperCol: { span: 20 },
  };

  const pageQuery = (params: {
    current?: number;
    pageSize?: number;
    name?: string;
    typeId?: number;
    state?: string;
    startPublishTime?: number;
    endPublishTime?: number;
  }) => {
    return request('/antelope-science/mng/creative/achievement/page', {
      method: 'POST',
      data: { ...params, pageIndex: params.current },
    }).then((e: { code: number; totalCount: any; result: any }) => ({
      success: e.code === 0,
      total: e.totalCount,
      data: e.result,
    }));
  };

  const prepare = async () => {
    try {
      const res = await Promise.all([getKeywords(), getCreativeTypes()]);
      setKeywords(res[0].result || []);
      const options = {};
      res[1].result.forEach(({ id, name }) => (options[id] = name));
      setTypeOptions(options || {});
    } catch (error) {
      message.error('获取类型失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);
  const handleCancel = () => {
    setModalVisible(false);
  };
  const editState = async (id: string) => {
    try {
      const updateStateResult = await updateConversion(id);
      if (updateStateResult.code === 0) {
        message.success(`操作成功`);
        actionRef.current?.reload();
      } else {
        message.error(`操作失败，请重试`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [editForm] = Form.useForm<{ keyword: any; keywordOther: string }>();
  const newKeywords = Form.useWatch('keyword', editForm);
  const handleOk = async () => {
    editForm
      .validateFields()
      .then(async (value) => {
        const submitRes = await updateKeyword({
          id: currentId,
          ...value,
        });
        if (submitRes.code === 0) {
          message.success(`所属产业编辑成功！`);
          actionRef.current?.reload();
          setModalVisible(false);
          editForm.resetFields();
        } else {
          message.error(`所属产业编辑失败，原因:{${submitRes.message}}`);
        }
      })
      .catch(() => {});
  };

  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title={'所属产业编辑'}
        width="780px"
        visible={modalVisible}
        maskClosable={false}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={handleOk}>
            确定
          </Button>,
        ]}
      >
        <Form {...formLayout} form={editForm}>
          <Form.Item
            name="keyword"
            label="所属产业"
            rules={[{ required: true }]}
            extra="多选（最多三个）"
          >
            <Checkbox.Group>
              <Row>
                {keywords?.map((i) => {
                  return (
                    <React.Fragment key={i.name}>
                      <Col span={6}>
                        <Checkbox
                          value={i.enumName}
                          style={{ lineHeight: '32px' }}
                          disabled={
                            newKeywords &&
                            newKeywords.length == 3 &&
                            !newKeywords.includes(i.enumName)
                          }
                        >
                          {i.name}
                        </Checkbox>
                        {i.enumName == 'OTHER' && newKeywords && newKeywords.indexOf('OTHER') > -1 && (
                          <Form.Item name="keywordOther" label="">
                            <Input placeholder="请输入" maxLength={10} />
                          </Form.Item>
                        )}
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  const stateColumn = {
    NOT_CONNECT: '未对接',
    CONNECTING: '对接中',
    CONVERTED: '已转化',
  };

  const columns: ProColumns<AchievementsTypes.Achievements>[] = [
    {
      title: '序号',
      hideInSearch: true,
      width: 80,
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '成果名称',
      dataIndex: 'name',
      renderText: (_: string, _record: any) => (
        <a
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            window.open(`/service-config/achievements-manage/detail?id=${_record.id}`);
          }}
        >
          {_}
        </a>
      ),
      width: 300,
    },
    {
      title: '应用行业',
      dataIndex: 'type',
      hideInSearch: true, // 用于隐藏筛选
      width: 200,
      renderText: (_: string[]) => (_ || []).join(',') || '/',
    },
    {
      title: '应用行业',
      dataIndex: 'typeId',
      hideInTable: true,
      valueEnum: typeOptions,
    },
    {
      title: '所属产业',
      dataIndex: 'keywordShow',
      hideInSearch: true, // 用于隐藏筛选
      renderText: (_: string[]) => (_ || []).join(',') || '/',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInTable: true,
      valueEnum: stateColumn,
    },
    {
      title: '发布时间',
      dataIndex: 'updateTime',
      hideInSearch: true, // 用于隐藏筛选
      width: 200,
    },
    {
      title: '发布时间',
      dataIndex: 'dateTime',
      hideInTable: true,
      valueType: 'dateRange',
    },
    {
      title: '状态',
      dataIndex: 'state',
      hideInSearch: true, // 用于隐藏筛选
      width: 200,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateObj, _) ? stateObj[_] : '/'}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      hideInSearch: true, // 用于隐藏筛选
      dataIndex: 'option',
      render: (_: any, record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return record.state == 'CONVERTED' ? (
          <div style={{ textAlign: 'center' }}>/</div>
        ) : (
          <Access accessible={accessible}>
            <Space>
              <Button
                type="link"
                style={{ padding: 0 }}
                onClick={() => {
                  setCurrentId(record.id);
                  setModalVisible(true);
                  editForm.setFieldsValue({
                    keyword: record.keyword || [],
                    keywordOther: record.keywordOther || '',
                  });
                }}
              >
                所属产业编辑
              </Button>
              <Popconfirm
                title={'确定已完成转化吗？'}
                okText="确定"
                cancelText="取消"
                onConfirm={() => editState(record.id)}
              >
                <Button type="link" style={{ padding: 0 }}>
                  完成转化
                </Button>
              </Popconfirm>
            </Space>
          </Access>
        );
      },
    },
  ];

  const handleMultiUpload = () => {
    history.push(`/science-technology-manage/achievements-manage/multi-upload`);
  };

  const [searchInfo, setSearchInfo] = useState<any>({});
  const exportList = async () => {
    const { name, typeId, state, dateTime } = searchInfo;
    try {
      const res = await creativeAchievementExport({
        name,
        typeId,
        state,
        dateTime: dateTime ? [dateTime[0], dateTime[1]] : undefined,
      });
      if (res?.data.size == 51) return message.warning('操作太过频繁，请稍后再试')
      const content = res?.data;
      const blob  = new Blob([content], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
      const fileName = '科产成果.xlsx';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error)
    }
  };
  return (
    <PageContainer>
      <div className={sc('container')}>
        <ProTable
          headerTitle={
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Access accessible={access['P_SM_CGGL']}>
                <Button type="primary" ghost onClick={handleMultiUpload}>
                  批量导入
                </Button>
                <Button
                  icon={<UploadOutlined />}
                  onClick={() => {
                    exportList();
                  }}
                >
                  导出
                </Button>
              </Access>
            </div>
          }
          options={false}
          rowKey="id"
          actionRef={actionRef}
          search={{
            span: 8,
            labelWidth: 100,
            defaultCollapsed: false,
            optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
          }}
          request={async (pagination) => {
            // 保存seatchInfo
            setSearchInfo(pagination);
            const result = await pageQuery(pagination);
            paginationRef.current = pagination;
            setTotal(result.total);
            return result;
          }}
          columns={columns}
          pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
        />
        {useModal()}
      </div>
    </PageContainer>
  );
};
