import scopedClasses from '@/utils/scopedClasses';
import './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useEffect, useState } from 'react';
import type { UploadProps } from 'antd';
import { debounce } from 'lodash';
import {
  Button,
  Cascader,
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
import type Common from '@/types/common';
import { CloudUploadOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@@/core/history';
import { useAccess, Access } from '@@/plugin-access/access';
import { getFileInfo } from '@/services/common';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { queryGovPage, exportGov, delGov, getGovImportTemplate } from '@/services/baseline-info';
import moment from 'moment/moment';
import { getWholeAreaTree } from '@/services/area';

export default () => {
  const [areaOptions, setAreaOptions] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // // 拿到当前角色的access权限兑现
  const access = useAccess();
  const sc = scopedClasses('baseline-government');
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [searchForm] = Form.useForm();
  const [dataSource, setDataSource] = useState<any>([]);
  const [errorDataSource, setErrorDataSource] = useState<any>([]);
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
            <Col span={6}>
              <Form.Item name="name" label="部门名称">
                <Input placeholder="请输入" allowClear autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="districtCodeType" label="级别">
                <Select placeholder="请选择" allowClear style={{ width: '200px' }}>
                  <Select.Option value={0}>未知</Select.Option>
                  <Select.Option value={1}>省级</Select.Option>
                  <Select.Option value={2}>市级</Select.Option>
                  <Select.Option value={3}>区县级</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="areaCode" label="所在区域">
                <Cascader
                  fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
                  options={areaOptions}
                  getPopupContainer={(triggerNode) => triggerNode}
                  placeholder="请选择"
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                style={{ marginRight: '20px' }}
                type="primary"
                key="search"
                onClick={() => {
                  const { districtCodeType, areaCode, name } = searchForm.getFieldsValue();
                  setSearChContent({
                    districtCodeType,
                    areaCode: areaCode ? areaCode[2] : undefined,
                    name,
                  });
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

  useEffect(() => {
    // 获取区域省+市下拉
    getWholeAreaTree({ endLevel: 'COUNTY' }).then((data) => {
      setAreaOptions(data || []);
    });
  }, []);
  // 获取分页数据
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true);
    try {
      const { result, totalCount, pageTotal, code } = await queryGovPage({
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
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getPage();
    // 获取区域省+市下拉
  }, [searchContent]);

  //删除
  const remove = async (organizationId: any) => {
    try {
      const removeRes = await delGov({ organizationId });
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
      title: '部门名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 200,
    },
    {
      title: ' 在线办理h5地址',
      dataIndex: 'serviceUrl',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '级别',
      dataIndex: 'districtCodeType',
      width: 120,
      render: (_: any, _record: any) => {
        return (
          <div>
            {_record.districtCodeType == 0 && '未知'}
            {_record.districtCodeType == 1 && '省级'}
            {_record.districtCodeType == 2 && '市级'}
            {_record.districtCodeType == 3 && '区县级'}
          </div>
        );
      },
    },
    {
      title: ' 权重',
      dataIndex: 'weight',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '是否为热门',
      dataIndex: 'hot',
      width: 120,
      render: (_: any, _record: any) => (_record.hot ? '热门' : '/'),
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
                  `/baseline/baseline-government-manage/detail?organizationId=${record?.organizationId}`,
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
                    `/baseline/baseline-government-manage/add?organizationId=${record?.organizationId}`,
                  );
                }}
              >
                编辑
              </Button>
            </Access>
            <Access accessible={access.PD_BLM_HTGL}>
              {record.deletable && (
                <Popconfirm
                  title="确定删除该部门信息？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => remove(record.organizationId as string)}
                >
                  <Button type="link">删除</Button>
                </Popconfirm>
              )}
            </Access>
          </div>
        );
      },
    },
  ];
  const errorColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      isEllipsis: true,
      width: 120,
    },
    {
      title: ' 错误原因',
      dataIndex: 'message',
      isEllipsis: true,
      width: 300,
    },
  ];
  // 上传导入逻辑
  const [uploadNum, setUploadNum] = useState<any>(0);
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      return;
    }
    if (info.file.status === 'error') return;
    if (info.file.status === 'done') {
      try {
        const { code } = info.file.response;
        if (code === 0) {
          setModalVisible(false);
          message.success(`导入成功`);
          getPage();
        } else {
          setErrorDataSource(info.file.response?.result);
          message.error(`上传失败，原因:{${info.file.response.message}}`);
        }
        setUploadNum(code);
      } catch (error) {
        console.log(error);
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
    action: '/antelope-business/mng/organization/gov/import',
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
  //导出
  const currentTime = moment(new Date()).format('YYYYMMDD');
  const exportDataClick = debounce(() => {
    if (isExporting) {
      return;
    }
    setIsExporting(true);
    const { districtCodeType, areaCode, name } = searchForm.getFieldsValue();
    exportGov({ districtCodeType, areaCode: areaCode ? areaCode[2] : undefined, name })
      .then((res) => {
        if (res?.data?.size == 51) return message.warning('操作太过频繁，请稍后再试');
        setIsExporting(false);
        const content = res.data;
        const blob = new Blob([content], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
        });
        const fileName = `${'政府信息管理' + '_' + currentTime}.xlsx`;
        const urlLink = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = urlLink;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        return res;
      })
      .catch(() => {
        setIsExporting(false);
      });
  }, 5000);
  // 上传导入弹框
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title="导入"
        visible={createModalVisible}
        width={700}
        style={{ height: '500px' }}
        footer={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
          getPage();
          setUploadNum(0);
        }}
      >
        {uploadNum === 0 ? (
          <div style={{ height: '300px' }}>
            <div style={{ height: '180px' }}>
              <div className={uploadNum.progress === 'true' ? 'supplierStaus' : ''}>
                <div style={{ marginBottom: '24px' }}>
                  请先下载
                  <span
                    style={{ color: 'rgba(143, 165, 255)', cursor: 'pointer' }}
                    onClick={async () => {
                      const { code, result } = await getGovImportTemplate();
                      if (code === 0) {
                        const res = await getFileInfo(result);
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
          </div>
        ) : (
          <SelfTable
            bordered
            loading={loading}
            scroll={{ y: 480 }}
            columns={errorColumns}
            dataSource={errorDataSource}
            pagination={null}
          />
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
                history.push(`/baseline/baseline-government-manage/add`);
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
          <Button
            style={{ textAlign: 'right' }}
            type="default"
            key="addStyle"
            onClick={exportDataClick}
          >
            导出
          </Button>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          loading={loading}
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
