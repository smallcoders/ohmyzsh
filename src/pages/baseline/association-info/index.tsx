import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState, useRef } from 'react';
import type { UploadProps } from 'antd';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Upload,
} from 'antd';
import SelfTable from '@/components/self_table';
import moment from 'moment/moment';
import type Common from '@/types/common';
import { deleteHotRecommend, editHotRecommend, queryHotRecommend } from '@/services/topic';
import {
  CloudUploadOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  InfoOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { history } from '@@/core/history';
import useLimit from '@/hooks/useLimit';
import { useAccess, Access } from '@@/plugin-access/access';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { exportMeetingData } from '@/services/baseline';
import { getTemplateFile } from '@/services/supplier';
import { getFileInfo } from '@/services/common';

export default () => {
  // // 拿到当前角色的access权限兑现
  const access = useAccess();
  const sc = scopedClasses('baseline-association');
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchContent, setSearChContent] = useState<any>({});
  // 搜索模块
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="topic" label="协会名称">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="topic" label="所属产业">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="publicUserName" label="级别">
                <Select placeholder="请选择" allowClear style={{ width: '200px' }}>
                  <Select.Option value={0}>省级</Select.Option>
                  <Select.Option value={1}>市级</Select.Option>
                  <Select.Option value={1}>区县级</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="enable" label="所在区域">
                <Select placeholder="请选择" allowClear style={{ width: '100%' }}>
                  <Select.Option value={0}>合肥</Select.Option>
                  <Select.Option value={1}>芜湖</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
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
  // 获取分页数据
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await queryHotRecommend({
        pageIndex,
        pageSize,
        ...searchContent,
      });
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
  useEffect(() => {
    getPage();
  }, [searchContent]);

  //删除
  const remove = async (id: string) => {
    try {
      const removeRes = await deleteHotRecommend(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPage();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
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
      title: '协会名称',
      dataIndex: 'topic',
      isEllipsis: true,
      width: 200,
    },
    {
      title: ' 所属产业',
      dataIndex: 'enable',
      width: 100,
      render: (_: any, _record: any) => (_record.enable ? '上架' : '下架'),
    },
    {
      title: '级别',
      dataIndex: 'contentCount',
      width: 120,
    },
    {
      title: '所在区域',
      dataIndex: 'weight',
      width: 80,
      render: (_: any, _record: any) => (_record.enable ? '热门' : '/'),
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <div className={sc('container-option')}>
            <Button
              type="link"
              onClick={() => {
                history.push(
                  `/baseline/baseline-association-manage/detail?recommendId=${record?.id}`,
                );
              }}
            >
              详情
            </Button>
            <Access accessible={access.PU_BLM_HTGL}>
              <Button
                type="link"
                onClick={() => {
                  history.push(
                    `/baseline/baseline-association-manage/add?id=${record?.id}&contentCount=${record?.contentCount}`,
                  );
                }}
              >
                编辑
              </Button>
            </Access>
            <Access accessible={access.PD_BLM_HTGL}>
              <Popconfirm
                title="确定删除该部门信息？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id as string)}
              >
                <Button type="link">删除</Button>
              </Popconfirm>
            </Access>
          </div>
        );
      },
    },
  ];
  // 上传导入逻辑
  const [uploadNum, setUploadNum] = useState<{
    successNum: number | undefined;
    failNum: number | undefined;
    filePath: string;
    progress?: string;
  }>({
    successNum: undefined,
    failNum: undefined,
    filePath: '',
    progress: 'false',
  });
  const handleChange = (info: UploadChangeParam) => {
    setUploadNum({
      ...uploadNum,
      progress: 'true',
    });
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'error') return;
    if (info.file.status === 'done') {
      try {
        const { result } = info.file.response;
        setUploadNum({
          failNum: result.failNum,
          successNum: result.successNum,
          filePath: result.filePath,
          progress: 'true',
        });
      } catch (error) {
        message.error(`上传失败，原因:{${info.file.response.message}}`);
      }
    }
    // this.setState(info)
  };
  const accept = '.xlsx';
  const handleBeforeUpload = (file: RcFile) => {
    const isLt20M = file.size / 1024 / 1024 < 20;
    if (!isLt20M) {
      message.error('上传的文件大小不得超过20M');
      return Upload.LIST_IGNORE;
    }
    try {
      const lastName = file.name.split('.');
      if (!accept.includes('.' + lastName[lastName.length - 1])) {
        message.error(`请上传以${accept}后缀名开头的文件`);
        return Upload.LIST_IGNORE;
      }
    } catch (error) {
      message.error('配置错误: ' + error);
      return Upload.LIST_IGNORE;
    }

    return true;
  };
  const { Dragger } = Upload;
  const props: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.xlsx',
    action: '/antelope-finance/mng/supplier/importSupplier',
    maxCount: 1,
    onRemove: () => false,
    onChange: handleChange,
    beforeUpload: handleBeforeUpload,
    progress: {
      strokeColor: {
        '0%': 'rgba(26, 102, 255)',
        '100%': 'rgba(26, 102, 255)',
      },
      strokeWidth: 8,
      format: (percent: number | undefined) => percent && `${parseFloat(percent.toFixed(2))}%`,
      showInfo: true,
    },
    showUploadList: {
      showRemoveIcon: false,
    },
  };

  // 上传导入弹框
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        className="supplier-uploads-file"
        title="导入"
        visible={createModalVisible}
        width={600}
        footer={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
          getPage();
          setUploadNum({
            successNum: undefined,
            failNum: undefined,
            filePath: '',
            progress: 'false',
          });
        }}
      >
        {uploadNum.failNum === undefined ? (
          <div style={{ height: '180px' }}>
            <div className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
              <div style={{ marginBottom: '24px' }}>
                请先下载
                <span
                  style={{ color: 'rgba(143, 165, 255)', cursor: 'pointer' }}
                  onClick={async () => {
                    const { code, result } = await getTemplateFile();
                    if (code === 0) {
                      const res = await getFileInfo(result);
                      console.log(res);
                      if (res.code === 0) {
                        window.location.href = res.result[0].path;
                      } else {
                        message.error('下载失败');
                      }
                    } else {
                      message.error('下载失败');
                    }
                  }}
                >
                  导入模版
                </span>
                ，按要求填写后上传
              </div>
            </div>
            <Dragger {...props} className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
              <p className="ant-upload-text">
                <CloudUploadOutlined />
                将文件拖拽到此处，或<span style={{ color: 'rgba(143, 165, 255)' }}>点击上传</span>
              </p>
              <p className="ant-upload-hint">支持 xlsx 格式，限20M以内</p>
            </Dragger>
          </div>
        ) : uploadNum.failNum === 0 ? (
          <div className="resultSuccess">
            <div className="icon">
              <FileTextOutlined />
            </div>
            <div className="text1">导入成功,共{uploadNum.successNum}条</div>
            <div>
              <Button
                type="primary"
                size="large"
                onClick={() => {
                  setModalVisible(false);
                  getPage();
                  setUploadNum({
                    successNum: undefined,
                    failNum: undefined,
                    filePath: '',
                    progress: 'false',
                  });
                }}
              >
                完成
              </Button>
            </div>
          </div>
        ) : (
          <div className="resultFail">
            <div className="icon">
              <FileExclamationOutlined />
            </div>
            <div className="text1">
              共导入
              {uploadNum.successNum !== undefined && uploadNum.failNum + uploadNum.successNum}
              条，成功 {uploadNum.successNum}
              条，失败 {uploadNum.failNum} 条
            </div>
            <div className="text2">
              <span>您可以下载失败数据，修改后重新导入</span>
              <a href={uploadNum.filePath}>下载失败数据</a>
            </div>
            <div>
              <Space>
                <Button
                  size="large"
                  onClick={() => {
                    setModalVisible(false);
                    getPage();
                    setUploadNum({ successNum: undefined, failNum: undefined, filePath: '' });
                  }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setUploadNum({ successNum: undefined, failNum: undefined, filePath: '' });
                  }}
                >
                  重新导入
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Modal>
    );
  };
  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <Access accessible={access.PA_BLM_HTGL}>
          <div>
            <Button
              type="primary"
              key="addStyle"
              onClick={() => {
                history.push(`/baseline/baseline-association-manage/add`);
              }}
            >
              <PlusOutlined /> 新增
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              type="default"
              key="addStyle"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              导入
            </Button>
          </div>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          // scroll={{ x: 1480 }}
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPage,
                  showSizeChanger: true,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total: number) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                }
          }
        />
      </div>
      {useModal()}
    </PageContainer>
  );
};
