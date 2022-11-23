import {
  UploadOutlined,
  FileExclamationOutlined,
  FileTextOutlined,
  CloudUploadOutlined,
} from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  message as antdMessage,
  message,
  Space,
  Popconfirm,
  Row,
  Col,
  Select,
  Drawer,
  DatePicker,
  Radio,
  Modal,
  Cascader,
  Upload,
} from 'antd';
import type { UploadProps } from 'antd';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState, useRef } from 'react';
import SelfTable from '@/components/self_table';
import type Common from '@/types/common';
import type supplierManagement from '@/types/supplier-management';
import type { RcFile, UploadChangeParam } from 'antd/lib/upload/interface';
import { listAllAreaCode } from '@/services/common';
import {
  getSupplierPage,
  removeSupplier,
  queryOrg,
  queryGyl,
  saveOrUpdateSupplier,
  detailSupplier,
  getTemplateFile,
} from '@/services/supplier';
import { getFileInfo } from '@/services/common';
import UploadFormFile from '@/components/upload_form/upload-form-file';
import { debounce } from 'lodash';
const sc = scopedClasses('user-config-admin-account-distributor');

export default () => {
  const [createDrawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [createModalVisible, setModalVisible] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<supplierManagement.Content[]>([]);
  const [searchContent, setSearChContent] = useState<supplierManagement.SearchContent>({});
  const [drawerContent, setDrawerContent] = useState<supplierManagement.DrawerContent>({});
  const [areaOptions, setAreaOptions] = useState<any>([]);
  const [drawerForm] = Form.useForm();

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  // 列表
  const getPages = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { result, totalCount, pageTotal, code, message } = await getSupplierPage({
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

  // 筛选
  const onFinish = (value: { supplier?: string; applyFlag?: number; hasCardNo?: number }) => {
    setSearChContent({
      ...value,
    });
  };

  // 删除
  const remove = async (id: number) => {
    try {
      const removeRes = await removeSupplier(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getPages();
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 所属城市
  const getCity = async () => {
    try {
      const areaRes = await listAllAreaCode();
      setAreaOptions((areaRes && areaRes.result) || []);
    } catch (error) {
      message.error('获取省市区数据出错');
    }
  };
  const cityInfo = useRef<string>('');
  const onChangeCity = (value: any, selectedOptions: any) => {
    if (value && selectedOptions) {
      const cityCode = value.join('-');
      const cityName = selectedOptions.map((item: any) => item.name).join('-');
      cityInfo.current = cityName + ',' + cityCode;
    }
    return;
  };

  // 文件回显
  const commitLetterFn = async (commitLetter: string) => {
    const { result } = await getFileInfo(commitLetter);
    const fileInfo = result
      ? [
          {
            uid: result[0].id,
            name: result[0].name + '.' + result[0].format,
            status: 'done',
          },
        ]
      : [];
    return fileInfo;
  };

  useEffect(() => {
    getPages();
  }, [searchContent]);

  useEffect(() => {
    getCity();
  }, []);

  // 列表
  const columns = [
    {
      title: '序号',
      key: 'sort',
      dataIndex: 'sort',
      width: 80,
      align: 'center',
      render: (_: any, __: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '供应商编码',
      key: 'code',
      dataIndex: 'code',
      align: 'center',
      width: 200,
      render: (code: string) => {
        return code === null ? '--' : code;
      },
    },
    {
      title: '供应商名称',
      key: 'name',
      dataIndex: 'name',
      align: 'center',
      isEllipsis: true,
      width: 260,
    },
    {
      title: '统一社会信用代码',
      key: 'creditCode',
      dataIndex: 'creditCode',
      align: 'center',
      width: 200,
      render: (creditCode: string) => {
        return creditCode === null ? '--' : creditCode;
      },
    },
    {
      title: '成立时间',
      key: 'estiblishTime',
      dataIndex: 'estiblishTime',
      isEllipsis: true,
      align: 'center',
      width: 200,
      render: (time1: string) => {
        return time1 === null ? '--' : time1.split(' ')[0];
      },
    },
    {
      title: '法定代表人',
      key: 'legalName',
      dataIndex: 'legalName',
      align: 'center',
      width: 200,
    },
    {
      title: '身份证号',
      key: 'cardNo',
      dataIndex: 'cardNo',
      align: 'center',
      width: 200,
      render: (card: string) => {
        return card ? card.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2') : '--';
      },
    },
    {
      title: '经营所在地',
      key: 'city',
      dataIndex: 'city',
      align: 'center',
      width: 200,
      render: (cityName: string) => {
        return cityName === null ? '--' : cityName.split(',')[0].split('-').join('/');
      },
    },
    {
      title: '合作时间',
      key: 'startDate',
      dataIndex: 'startDate',
      align: 'center',
      width: 200,
      render: (time2: string) => {
        return time2 === null ? '--' : time2.split(' ')[0];
      },
    },
    {
      title: '允许申请供应链e贷',
      key: 'applyFlag',
      dataIndex: 'applyFlag',
      align: 'center',
      render: (_: any, record: any) => {
        return record.applyFlag === 0 ? '是' : '否';
      },
      width: 200,
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      key: 'option',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <div>
            <Button
              type="link"
              onClick={async () => {
                setDrawerContent({ ...record });
                setDrawerVisible(true);
                drawerForm.setFieldsValue({
                  ...record,
                  city: record.city === null ? '' : record.city?.split(',')[0].split('-'),
                  startDate: record.startDate === null ? '' : moment(record.startDate),
                  cardNo: record.cardNo === null ? '' : record.cardNo,
                  commitLetter:
                    record.commitLetter === null ? [] : await commitLetterFn(record.commitLetter),
                });
              }}
            >
              编辑
            </Button>
            <Button
              type="link"
              onClick={async () => {
                const { result } = await detailSupplier(record.id);
                const res = await getFileInfo(result.commitLetter);
                setDrawerContent({
                  ...result,
                  detail: 'show',
                  commitLetter: res.code === 0 ? res.result[0].path : '',
                });
                setDrawerVisible(true);
              }}
            >
              详情
            </Button>

            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(record.id as number)}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  // 列表上搜索框
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm} onFinish={onFinish}>
          <Row>
            <Col span={7}>
              <Form.Item name="supplier" label="供应商" wrapperCol={{ span: 18 }}>
                <Input placeholder="请输入供应商编码、名称或统一社会信用代码" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item
                name="applyFlag"
                label="允许申请供应链e贷"
                labelCol={{ span: 8, offset: 1 }}
              >
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>是</Select.Option>
                  <Select.Option value={1}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="hasCardNo" label="是否有身份证">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={0}>是</Select.Option>
                  <Select.Option value={1}>否</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button style={{ marginRight: 20 }} type="primary" key="primary1" htmlType="submit">
                查询
              </Button>
              <Button
                type="primary"
                key="primary2"
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

  // 模糊搜索
  const [options, setOptions] = useState([]);
  const [list, setList] = useState([]);
  const [codeGyl, setCodeGyl] = useState('');
  const handleSearch = debounce(async (value: string) => {
    if (value === '' || value.length <= 2) return;
    try {
      const { result } = await queryOrg({ word: value });
      setList(result);
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const options = result?.map((item: { name: string; creditCode: string }) => {
        return {
          value: item.name,
          label: item.name,
        };
      });
      setOptions(options);
    } catch (error) {
      console.log(error);
    }
  }, 200);

  // 供应商校验
  const nameValidator = (_: any, value: string) => {
    if (value && codeGyl === null) return Promise.reject(new Error('该供应商不存在'));
    return Promise.resolve();
  };

  // 新增/编辑
  const addOrUpdate = async () => {
    drawerForm
      .validateFields()
      .then(async (value: any) => {
        const addOrUpdateRes = await (drawerContent.id
          ? saveOrUpdateSupplier({
              ...value,
              id: drawerContent.id,
              city: cityInfo.current,
              commitLetter: value.commitLetter[0].uid,
              startDate: moment(value.startDate).format('YYYY-MM-DD'),
            })
          : saveOrUpdateSupplier({
              ...value,
              city: cityInfo.current,
              startDate: moment(value.startDate).format('YYYY-MM-DD'),
              commitLetter: value.commitLetter[0].uid,
            }));
        if (addOrUpdateRes.code === 0) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          onClose();
          message.success(drawerContent.id ? '编辑成功' : '新增成功');
          getPages();
        } else {
          message.error(drawerContent.id ? '编辑失败' : '新增失败，原因:' + addOrUpdateRes.message);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  // 新增编辑抽屉
  const onClose = () => {
    setDrawerVisible(false);
    setDrawerContent({});
    drawerForm.resetFields();
    setOptions([]);
  };
  const useDrawer = (): React.ReactNode => {
    return (
      <Drawer
        title={drawerContent?.detail ? '详情' : drawerContent.id ? '编辑' : '新增'}
        width="720px"
        placement="right"
        onClose={onClose}
        visible={createDrawerVisible}
        footer={
          drawerContent?.detail ? null : (
            <Space>
              <Button onClick={onClose}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  addOrUpdate();
                }}
              >
                确定
              </Button>
            </Space>
          )
        }
        footerStyle={{ display: 'flex', justifyContent: 'end' }}
      >
        {drawerContent?.detail ? (
          <div className={sc('container-detail')}>
            <div className="text">
              <div className="name">供应商编码：</div>
              <div className="text2">{drawerContent?.code || '--'}</div>
            </div>
            <div className="text">
              <div className="name">供应商名称：</div>
              <div className="text2">{drawerContent?.name || '--'}</div>
            </div>
            <div className="text">
              <div className="name">供应商统一社会信用代码：</div>
              <div className="text2">{drawerContent?.creditCode || '--'}</div>
            </div>
            <div className="text">
              <div className="name">成立时间：</div>
              <div className="text2">{drawerContent?.estiblishTime?.split(' ')[0] || '--'}</div>
            </div>
            <div className="text">
              <div className="name">身份证号：</div>
              <div className="text2">
                {drawerContent.cardNo === '' || drawerContent.cardNo === null
                  ? '--'
                  : drawerContent?.cardNo?.replace(/^(.{4})(?:\d+)(.{4})$/, '$1******$2')}
              </div>
            </div>
            <div className="text">
              <div className="name">经营所在地：</div>
              <div className="text2">
                {drawerContent.city === null ? '--' : drawerContent?.city?.split(',')[0].split('-')}
              </div>
            </div>
            <div className="text">
              <div className="name">合作时间：</div>
              <div className="text2">{drawerContent?.startDate || '--'}</div>
            </div>
            <div className="text">
              <div className="name">允许申请供应链e贷：</div>
              <div className="text2">{drawerContent?.applyFlag === 0 ? '是' : '否'}</div>
            </div>
            <div className="text">
              <div className="name">承诺函：</div>
              <div className="text2">
                {drawerContent.commitLetter === '' ? (
                  <div className="text2">{'--'}</div>
                ) : (
                  <img src={drawerContent.commitLetter} alt="" />
                )}
              </div>
            </div>
          </div>
        ) : (
          <Form
            form={drawerForm}
            name="basic"
            labelCol={{ span: 6 }}
            style={{ width: '600px' }}
            validateTrigger={['onBlur']}
          >
            <Form.Item
              label="供应商名称"
              name="name"
              required
              rules={[
                { required: true, message: '请输入供应商名称' },
                { validator: nameValidator },
              ]}
            >
              {drawerContent.id && drawerContent.creditCode !== null ? (
                <Input readOnly style={{ backgroundColor: 'rgba(245, 245, 245)' }} />
              ) : (
                <Select
                  onSearch={handleSearch}
                  showSearch
                  filterOption={false}
                  options={options}
                  placeholder="请选择或输入搜索"
                  onChange={async (value: string) => {
                    if (value) {
                      const queryOrgInfo: {
                        name: string;
                        estiblishTime: string;
                        creditCode: string;
                        legalPersonName: string;
                      } = list.find((item: { name: string }) => item.name === value);

                      const { result } = await queryGyl({ name: value });
                      setCodeGyl(result === null ? null : result.code);
                      if (result === null) {
                        drawerForm.setFieldsValue({
                          code: null,
                          creditCode: null,
                          estiblishTime: null,
                          legalName: null,
                        });
                      } else {
                        drawerForm.setFieldsValue({
                          code: result.code,
                          creditCode: queryOrgInfo.creditCode,
                          estiblishTime: queryOrgInfo.estiblishTime.split(' ')[0],
                          legalName: queryOrgInfo.legalPersonName,
                        });
                      }
                    }
                  }}
                />
              )}
            </Form.Item>

            <Form.Item label="供应商编码" name="code">
              <Input
                readOnly
                style={{ backgroundColor: 'rgba(245, 245, 245)' }}
                placeholder="输入供应商名称后显示该字段内容"
              />
            </Form.Item>

            <Form.Item label="统一社会信用代码" name="creditCode">
              <Input
                maxLength={18}
                readOnly
                style={{ backgroundColor: 'rgba(245, 245, 245)' }}
                placeholder="输入供应商名称后显示该字段内容"
              />
            </Form.Item>

            <Form.Item label="成立时间" name="estiblishTime">
              <Input
                style={{ backgroundColor: 'rgba(245, 245, 245)' }}
                readOnly
                placeholder="输入供应商名称后显示该字段内容"
              />
            </Form.Item>

            <Form.Item label="法定代表人" name="legalName">
              <Input
                readOnly
                maxLength={35}
                style={{ backgroundColor: 'rgba(245, 245, 245)' }}
                placeholder="输入供应商名称后显示该字段内容"
              />
            </Form.Item>

            <Form.Item
              label="身份证号"
              name="cardNo"
              rules={[
                { required: true, message: '请输入身份证号' },
                {
                  pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                  message: '请输入正确的身份证号',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={18} />
            </Form.Item>

            <Form.Item
              label="经营所在地"
              name="city"
              rules={[{ required: true, message: '请输入经营所在地' }]}
            >
              <Cascader
                getPopupContainer={(trigger: HTMLElement) => trigger as HTMLElement}
                placeholder={'请选择'}
                allowClear={true}
                options={areaOptions}
                fieldNames={{ label: 'name', value: 'code', children: 'nodes' }}
                onChange={onChangeCity}
              />
            </Form.Item>
            <Form.Item
              label="详细地址"
              name="detailArea"
              rules={[{ required: true, message: '请输入详细地址' }]}
            >
              <Input placeholder="请输入" />
            </Form.Item>
            <Form.Item
              label="合作时间"
              name="startDate"
              rules={[{ required: true, message: '请选择合作时间' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="允许申请供应链e贷"
              name="applyFlag"
              initialValue={0}
              rules={[{ required: true, message: '请选择' }]}
              labelCol={{ span: 10 }}
            >
              <Radio.Group>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="承诺图"
              name="commitLetter"
              extra="支持上传图片、压缩包文件，20M以内"
              rules={[{ required: true, message: '请选择承诺图' }]}
            >
              <UploadFormFile accept=".png,.jpeg,.jpg,.zip" maxCount={1} maxSize={50}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </UploadFormFile>
            </Form.Item>
          </Form>
        )}
      </Drawer>
    );
  };

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
        className="uploads-file"
        title="导入"
        visible={createModalVisible}
        width={600}
        footer={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => {
          setModalVisible(false);
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
            <div className={uploadNum.progress === 'true' ? 'staus' : ''}>
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
            <Dragger {...props} className={uploadNum.progress === 'true' ? 'staus' : ''}>
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
                  getPages();
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
        <div className="title">
          <Space>
            <a
              key="primary3"
              className="export-btn"
              onClick={() => {
                setModalVisible(true);
              }}
            >
              导入
            </a>
            <Button
              type="primary"
              key="primary4"
              onClick={() => {
                setDrawerVisible(true);
              }}
            >
              新增
            </Button>
          </Space>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={columns}
          rowKey="id"
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                  onChange: getPages,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: () =>
                    `共${pageInfo.totalCount}条记录 第${pageInfo.pageIndex}/${
                      pageInfo.pageTotal || 1
                    }页`,
                }
          }
        />
      </div>
      {useDrawer()}
      {useModal()}
    </PageContainer>
  );
};
