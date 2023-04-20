import {
  Button,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Modal, Select,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import { getHotNews, saveHotNews, updateSendedNews, deleteHotNews } from '@/services/baseline';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import SelfTable from '@/components/self_table';
const sc = scopedClasses('real-time-hotspot-manage');

const hostMap = {
  'http://172.30.33.222:10086': 'http://172.30.33.222',
  'http://172.30.33.212:10086': 'http://172.30.33.212',
  'http://10.103.142.216': 'https://preprod.lingyangplat.com',
  'http://10.103.142.222': 'https://greenenv.lingyangplat.com',
  'http://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'https://manage.lingyangplat.com': 'https://www.lingyangplat.com',
  'http://localhost:8000': 'http://172.30.33.222'
}


export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [visible, setVisible] = useState<any>(false);
  const [modalForm] = Form.useForm()
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getHotNews({
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

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '提示',
      content: '确认将内容删除?',
      okText: '删除',
      onOk: () => {
        const formData = new FormData();
        formData.append('configId', record.id);
        deleteHotNews(formData).then((res) => {
          if (res.code === 0){
            antdMessage.success('删除成功')
            const { totalCount, pageIndex, pageSize } = pageInfo
            const newTotal = totalCount - 1 || 1;
            const newPageTotal = Math.ceil(newTotal / pageSize) || 1
            getPage(pageIndex >  newPageTotal ? newPageTotal : pageIndex)
          } else {
            antdMessage.error(res.message)
          }
        })
      },
    })
  }

  const handleAdd = async () => {
    await modalForm.validateFields()
    const formData = new FormData();
    formData.append('url', modalForm.getFieldValue('url'));
    saveHotNews(formData).then((res) => {
      if (res.code === 0){
        Modal.info({
          title: '操作成功',
          okText: '我知道了',
          content: '5分钟左右会更新数据录入状态,请及时关注'
        })
        getPage(pageInfo.pageIndex)
        setVisible(false)
        modalForm.resetFields()
      } else {
        antdMessage.error(res.message)
      }
    })
  }

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
      width: 150,
      render: (title: string) => {
        return (title || '--')
      }
    },
    {
      title: '内容原址',
      dataIndex: 'newUrl',
      isEllipsis: true,
      width: 250,
      render: (newUrl: string) => {
        return (newUrl || '--')
      }
    },
    {
      title: '平台内地址',
      dataIndex: 'currentUrl',
      isEllipsis: true,
      width: 250,
      render: (_: any, record: any) => {
        const { origin } = window.location
        return <span>{ record.crawered === 1 ? `${hostMap[origin] || 'http://172.30.33.222'}/antelope-baseline/industry-moments/#/detail?id=${record.articleId}` : '--' }</span>
      }
    },
    {
      title: '录入状态',
      dataIndex: 'crawered',
      width: 150,
      render: (crawered: number) => {
        return <span style={ crawered === 2 ? {color: 'red'} : {}}>{{0: "录入中", 1: '录入成功', 2: '录入失败'}[crawered] || '--'}</span>
      }
    },
    {
      title: '是否推送',
      width: 150,
      dataIndex: 'sended',
      render: (sended: number) => {
        return <span>{sended === 1 ? '是' : '否'}</span>
      }
    },
    {
      title: '生成时间',
      width: 200,
      dataIndex: 'createTime',
      render: (createTime: string) => {
        return <span>{createTime || '--'}</span>
      }
    },
    {
      title: '操作人',
      dataIndex: 'createByName',
      width: 200,
      render: (createByName: string) => {
        return (createByName || '--')
      },
    },
    {
      title: '操作时间',
      dataIndex: 'updateTime',
      width: 200,
      render: (updateTime: string) => {
        return <span>{updateTime || '--'}</span>
      }
    },
    {
      title: '操作',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => {
        if (record.crawered === 0){
          return <span>--</span>
        }
        return (
          <div style={{whiteSpace: 'break-spaces'}}>
            <Button
              size="small"
              type="link"
              onClick={() => {
                handleDelete(record)
              }}
            >
              删除
            </Button>
            {
              record.crawered === 1 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  const formData = new FormData();
                  formData.append('configId', record.id);
                  formData.append('status', `${record.sended === 1 ? 0 : 1}`);
                  updateSendedNews(formData).then((res) => {
                    if (res.code === 0){
                      antdMessage.success('设置成功')
                      getPage(pageInfo.pageIndex)
                    } else {
                      antdMessage.error(res.message)
                    }
                  })
                }}
              >
                {record.sended ? '设置未推送' : '设置已推送'}
              </Button>
            }
            {
              record.crawered === 2 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  const content = (
                    <div>
                      {record.riskInfo}<br/>
                      {
                        record.similar &&
                        <>
                          内容标题: <br/>
                          {record.similarArticleTitle || '--'}<br/>
                          内容地址: <br/>
                          {
                            record.similarArticleId ? `${hostMap[location.origin] || 'http://172.30.33.222'}/antelope-baseline/industry-moments/#/detail?id=${record.similarArticleId}` : '--'
                          }
                        </>
                      }
                    </div>
                  )
                  Modal.warning({
                    title: '失败原因',
                    content,
                    okText: '我知道了',
                  })
                }}
              >
                失败原因
              </Button>
            }
            {
              record.crawered === 1 &&
              <Button
                size="small"
                type="link"
                onClick={() => {
                  const input = document.createElement('textarea');
                  document.body.appendChild(input);
                  input.value = `${hostMap[origin] || 'http://172.30.33.222'}/antelope-baseline/industry-moments/#/detail?id=${record.articleId}`;
                  input.select();
                  document.execCommand('copy');
                  antdMessage.success('复制成功');
                  document.body.removeChild(input);
                }}
              >
                复制地址
              </Button>
            }
          </div>
        )
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
        <Form form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item labelCol={{span: 6}} name="title" label="标题">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 6}}  name="createBy" label="操作人">
                <Input placeholder="请输入" allowClear />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 8}}  name="time" label="操作时间范围">
                <DatePicker.RangePicker
                  allowClear
                  disabledDate={(current) => {
                    return current > moment().endOf('day');
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 6}}  name="crawered" label="录入状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[{label: '录入成功', value: 1}, {label: '录入中', value: 0}, {label: '录入失败', value: 2}]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item labelCol={{span: 6}}  name="sended" label="推送状态">
                <Select
                  placeholder="请选择"
                  allowClear
                  options={[{label: '是', value: 1}, {label: '否', value: 0}]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="button-box">
          <Button
            style={{ marginRight: 20 }}
            type="primary"
            key="search"
            onClick={() => {
              const search = searchForm.getFieldsValue();
              if (search.time) {
                search.beginTime = moment(search.time[0]).startOf('days').format('YYYY-MM-DD HH:mm:ss');
                search.endTime = moment(search.time[1]).endOf('days').format('YYYY-MM-DD HH:mm:ss');
              }
              if (search.state){
                search.state = search.state * 1
              }
              delete search.time;
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
        </div>
      </div>
    );
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-body')}>
        <Button
          type="primary"
          onClick={() => {
            modalForm.resetFields()
            setVisible(true)
          }}
        >
          新增
        </Button>
        <SelfTable
          rowKey="id"
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
      <Modal
        visible={visible}
        title="新增"
        onCancel={() => {
          setVisible(false)
        }}
        keyboard={false}
        maskClosable={false}
        width={550}
        okText="确定"
        onOk={handleAdd}
      >
        <Form form={modalForm}>
          <Form.Item
            name="url"
            label="热点内容地址"
            required
            rules={[{message: '请输入热点内容地址', required: true}]}
            validateTrigger="onBlur"
          >
            <Input.TextArea rows={4} placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};
