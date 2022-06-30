import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Form, Input, Table, Upload, Space, message, Popconfirm, Modal, Breadcrumb, Image } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import type { ColumnsType } from 'antd/lib/table';
import { UploadFile } from 'antd/lib/upload/interface';
import SelfTable from '@/components/self_table';
import UploadForm from '@/components/upload_form';
import {
  getActivityProducts,
  createActivity, // 新增活动
  getActivityDetail, // 活动详情
} from '@/services/purchase';
import moment, { relativeTimeRounding } from 'moment';
import { useState, useEffect } from 'react';
import { Link, history, Prompt } from 'umi';
import { routeName } from '../../../../config/routes';

const { Column } = Table;

interface Pic {
  id: number;
  picId: string;
  banner: string;
}

enum AddedState {
  OnShelf = 0, // 上架
  DownShelf = 1, // 下架
  Temporary = 2, // 暂存
}

interface Spec {
  specsId?: string;
  salePrice?: number; // 活动售价
  markPrice?: number; // 划线价
}

interface Product {
  productId: number;
  specs: number;
}
interface CreateActData {
  id?: number;
  actNo?: string; // 活动编码
  name?: string; // 活动名称
  startTime?: string; // YYYY_MM_DD HH:mm:ss
  endTime?: string;
  sortNo?: number; // 排序权重
  firstPic?: Pic; // 首页图
  otherPic?: Pic[]; // 活动图
  content?: string; // 活动介绍
  actSpreadWord?: string; // 促销词
  addedState?: AddedState;
  product?: AddedState;
}

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  isEllipsis: boolean
}

export default () => {
  // 是否是详情页
  const [isDetail, setIsDetail] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<any>({});
  const isEditing = Boolean(editingItem.id && !isDetail);

  const prepare = async () => {
    try {
      // const prepareResultArray = await Promise.all([getLiveTypesPage({
      //   pageIndex: 1,
      //   pageSize: 100,
      // })]);
      // setAppTypes(prepareResultArray[0].result || []);

      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };

      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getActivityDetail(id);
        console.log(detailRs, 'detailRs');
        let editItem = { ...detailRs.result };
        // editItem.typeIds = editItem.typeIds?.split(',').map(Number);//返回的类型为字符串，需转为数组
        console.log(editItem, '---editItem')
        // if (detailRs.code === 0) {
        //   editItem.isSkip = detailRs.result.url ? 1 : 0;
        //   setIsSkip(editItem.isSkip);
        //   // setIsBeginTopAndEditing(Boolean(editItem.isTopApp));
        //   console.log(editItem, 'res---editItem');
          setEditingItem({
            ...editItem, 
            // startTime: [moment(editingItem.startDate), moment(editingItem.endDate)]
          });
        // } else {
        //   message.error(`获取详情失败，原因:{${detailRs.message}}`);
        // }
      }
      if(isDetail == '1') {
        setIsDetail(true);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 5,
    totalCount: 0,
    pageTotal: 0,
  });
  const [dataSource, setDataSource] = useState<any>([]);//可选商品数据
  
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
      // render: (_: any, _record: any, index: number) =>
      //  index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      isEllipsis: true,
      width: 200,
    },
    {
      title: '商品图',
      dataIndex: 'productPic',
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
      width: 120
    },
    {
      title: '商品型号',
      dataIndex: 'productModel',
      width: 120
    },
    {
      title: '商品采购价',
      dataIndex: 'purchasePricePart',
      width: 80,
    },
    {
      title: '商品销售价',
      dataIndex: 'typeNames',
      isEllipsis: true,
      width: 280,
    },
    {
      title: '商品划线价',
      dataIndex: 'clickCount',
      width: 100
    },
    {
      title: '权重',
      dataIndex: 'videoStatus',
      width: 180
    },
    {
      title: '操作',
      width: 200,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            {record.videoStatus != 2 && (
              <a
                href="#"
                onClick={() => {
                  // history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
                }}
              >
                编辑
              </a>
            )}
            { 
              record.lineStatus ? (
                <Popconfirm
                  title="确定下架么？"
                  okText="确定"
                  cancelText="取消"
                  // onConfirm={() => updateOnlineStatus(record.id as string, false)}
                >
                  <a href="#">下架</a>
                </Popconfirm>
              ) : (
                <Popconfirm
                  title="确定上架么？"
                  okText="确定"
                  cancelText="取消"
                  // onConfirm={() => updateOnlineStatus(record.id as string, true)}
                >
                  <a href="#">上架</a>
                </Popconfirm>
              )
            }
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              // onConfirm={() => remove(record.id as string)}
            >
              <a href="#">删除</a>
            </Popconfirm>
             <Popconfirm
              title={`确定置顶么？`}
              okText="确定"
              cancelText="取消"
              // onConfirm={() => updateTopStatus(record.id as string, true,)}
            >
              <a href="#">置顶</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const getProducts = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getActivityProducts({
        pageIndex,
        pageSize
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
    getProducts();
    prepare();
  }, []);

  const [files, setFiles] = useState<any>([]); // 首页图
  const [files2, setFiles2] = useState<any>([]); // 活动图
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const handleChange = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      setUploadLoading(false);
      return;
    }

    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        const upLoadResult = info?.fileList.map((p) => {
          return {
            picId: p.response?.result?.id,
            banner: p.response?.result?.path
          };
        });
        console.log(upLoadResult, '上传成功后的结果');
        setFiles(upLoadResult);
        setUploadLoading(false);
      } else {
        setUploadLoading(false);
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };
  const onRemove = (file: UploadFile<any>) => {
    if (file.status === 'uploading' || file.status === 'error') {
      setUploadLoading(false);
    }
    const files_copy = [...files];
    const existIndex = files_copy.findIndex((p) => p.storeId === file?.response?.result);
    if (existIndex > -1) {
      files_copy.splice(existIndex, 1);
      console.log(files_copy, '删除图片后的结果');
      setFiles(files_copy);
    }
  };
  const handleChange2 = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'uploading') {
      setUploadLoading(true);
      return;
    }
    if (info.file.status === 'error') {
      setUploadLoading(false);
      return;
    }

    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        const upLoadResult = info?.fileList.map((p) => {
          return {
            picId: p.response?.result?.id,
            banner: p.response?.result?.path
          };
        });
        console.log(upLoadResult, '上传成功后的结果');
        setFiles2(upLoadResult);
        setUploadLoading(false);
      } else {
        setUploadLoading(false);
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };
  const onRemove2 = (file: UploadFile<any>) => {
    if (file.status === 'uploading' || file.status === 'error') {
      setUploadLoading(false);
    }
    const files_copy = [...files2];
    const existIndex = files_copy.findIndex((p) => p.storeId === file?.response?.result);
    if (existIndex > -1) {
      files_copy.splice(existIndex, 1);
      console.log(files_copy, '删除图片后的结果');
      setFiles2(files_copy);
    }
  };

  // 选择商品弹框
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [choosedProducts, setChoosedProducts] = useState<any>([]); //已选商品数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  let selectKeys: any = []; // 存储选中的数据
  const handleOk = async () => {
    let arr: any = [];
    if(selectedRowKeys) {
      selectedRowKeys.map((i: any) => {
        arr.push(JSON.parse(i))
      }) 
    }
    let list = choosedProducts.concat(arr);
    let res: any = [];
    list.forEach((item: any) => {
      let flag = res.some(e => {
        if(item.id === e.id){
          return true;
        }
      })
      if(!flag){
        res.push(item)
      }
    })
    setChoosedProducts(res);
    setSelectedRowKeys([]);
    setModalVisible(false);
  };
  const handleCancel = () => {
    setModalVisible(false);
    setSelectedRowKeys([]);
  };
  const chooseColumns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) => index + 1,
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      // isEllipsis: true,
      width: 200,
    },
    {
      title: '商品图',
      dataIndex: 'productPic',
      render: (_: string, _record: any) => (
        <Image width={100} src={_} />
      ),
      width: 120
    },
    {
      title: '商品型号',
      dataIndex: 'productModel',
      width: 120
    },
    {
      title: '商品采购价',
      dataIndex: 'purchasePricePart',
      width: 80,
    },
    {
      title: '商品销售价',
      dataIndex: 'typeNames',
      // isEllipsis: true,
      width: 280,
    },
    {
      title: '商品划线价',
      dataIndex: 'clickCount',
      width: 100
    },
    {
      title: '权重',
      dataIndex: 'videoStatus',
      width: 180
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                // history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
              }}
            >
              商品详情
            </a>
            <a
              href="#"
              onClick={() => {
                // history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
              }}
            >
              设置价格
            </a>
            <a
              href="#"
              onClick={() => {
                // history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
              }}
            >
              权重设置
            </a>
            <a
              href="#"
              onClick={() => {
                // history.push(`${routeName.ANTELOPE_LIVE_MANAGEMENT_ADD}?id=${record.id}`);
              }}
            >
              删除
            </a>
          </Space>
        );
      },
    },
  ];
  // 选择商品弹框
  const useModal = (): React.ReactNode => {
    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };
    const start = () => {
      Table.SELECTION_ALL;
    };
  
    const rowSelection = {
      preserveSelectedRowKeys: true, // 设置翻页保存key
      selectedRowKeys,
      onChange: onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Modal
        title={ '选择商品'}
        width="800px"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={handleOk}
          >
            确定
          </Button>,
        ]}
      >
        <div className={'container-table-body'} style={{marginTop: 10}}>
          <div style={{ marginBottom: 16 }}>
            <Button type="primary" onClick={start} loading={loading}>
              全选商品
            </Button>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选商品：${selectedRowKeys.length}` : ''}
            </span>
          </div>
          <Table
            bordered
            scroll={{ x: 1400 }}
            rowKey={(r: any) => {return JSON.stringify(r)}}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataSource}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getProducts,
                    total: pageInfo.totalCount,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: (total) =>
                      `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`,
                  }
            }
          />
        </div>
      </Modal>
    );
  };

  /**
   * 新增/编辑
   */
  const addOrUpdate = (addedState: number) => {
    form
      .validateFields()
      .then(async (value: any) => {
        const tooltipMessage = editingItem.id ? '编辑' : '新增';
        // console.log(value, '<---value');
        const hide = message.loading(`正在${tooltipMessage}`);
        console.log({
          ...value,
          startTime: moment(value.startTime[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(value.startTime[1]).format('YYYY-MM-DD HH:mm:ss'),
          firstPic: files,
          otherPic: files2,
          sortNo: value.sortNo ? Number(value.sortNo) : null
        });
        // setAddOrUpdateLoading(true);
        // // 编辑
        let addorUpdateRes = {};
        if(editingItem.id) {
        //   addorUpdateRes = await updateLive({
        //     ...value,
        //     startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
        //     endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
        //     closeReplay: value.extended?.indexOf('replay') > -1 ? 0 : 1,
        //     closeKf: value.extended?.indexOf('kf') > -1 ? 0 : 1,
        //     closeLike: value.extended?.indexOf('like') > -1 ? 0 : 1,
        //     closeGoods: value.extended?.indexOf('goods') > -1 ? 0 : 1,
        //     closeComment: value.extended?.indexOf('comment') > -1 ? 0 : 1,
        //     closeShare: value.extended?.indexOf('share') > -1 ? 0 : 1,
        //     id: editingItem.id
        //   });
        //   hide()
        }else {
          addorUpdateRes = await createActivity({
            ...value,
            startTime: moment(value.startTime[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.startTime[1]).format('YYYY-MM-DD HH:mm:ss'),
            firstPic: files,
            otherPic: files2,
            sortNo: value.sortNo ? Number(value.sortNo) : null,
            addedState: addedState
          });
        //   hide();
        }
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          // setIsClosejumpTooltip(false);
          history.push(`/purchase-manage/promotions-manage`);
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        // setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        // message.error('服务器错误，请稍后重试');
        console.log(err);
      });
  };

  return (
    <PageContainer 
      title={false}
      header={{
        title: isEditing ? `活动编辑` : isDetail ? '活动详情' : '活动新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/purchase-manage/promotions-manage">活动管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {isEditing ? `活动编辑` : isDetail ? '活动详情' : '活动新增'}
            </Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <h1>活动基础信息</h1>
      <Form labelCol={{ span: 4 }}  form={form}>
        <Form.Item label="活动编码" name="actNo" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.actNo || '--'}</span>
          ) : (
            <Input placeholder="请输入" />
          )}
        </Form.Item>
        <Form.Item label="活动名称" name="name" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.name || '--'}</span>
          ) : (
            <Input placeholder="请输入" />
          )}
        </Form.Item>
        <Form.Item label="活动开始时间" name="startTime" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.startTime + '~' + editingItem?.endTime || '--'}</span>
          ) : (
            <DatePicker.RangePicker
              format="YYYY-MM-DD HH:mm:ss"
              showTime
              allowClear
            />
          )}
        </Form.Item>
        <Form.Item label="活动权重" name="sortNo" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.sortNo || '--'}</span>
          ) : (
            <Input placeholder="请输入1~100的整数，数字越大排名越靠前" type="number" />
          )}
        </Form.Item>
        <Form.Item label="活动促销词" name="actSpreadWord" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.actSpreadWord || '--'}</span>
          ) : (
           <Input placeholder="请输入" />
          )}
        </Form.Item>
        <Form.Item
          label="首页采购图"
          name="firstPic"
          extra={`${!isDetail ? '图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下' : ''}`}
        >
          {isDetail ? (
            // <Image.PreviewGroup>
            //   {editingItem?.firstPic &&
            //     editingItem?.firstPic.map((p: any) => (
                  <Image height={200} width={300} src={editingItem.firstPic?.banner} />
            //     ))}
            // </Image.PreviewGroup>
          ) : (
            <Upload 
              maxCount={1} 
              listType="picture-card"
              action='/antelope-manage/common/upload/record'
              onChange={handleChange}
              onRemove={onRemove}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
            >
              {uploadButton}
            </Upload>
          )}
        </Form.Item>

        <Form.Item
          label="活动图"
          name="otherPic"
          extra={`${!isDetail ? '图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下，支持3张图片' : ''}`}
          rules={[{ required: !isDetail }]}
        >
          {isDetail ? (
            <Image.PreviewGroup>
              {editingItem?.otherPic &&
                editingItem?.otherPic.map((p: any) => (
                  <Image key={p?.picId} height={200} width={300} src={p?.banner} />
                ))}
            </Image.PreviewGroup>
          ) : (
            <Upload 
              maxCount={3} 
              listType="picture-card"
              action='/antelope-manage/common/upload/record'
              onChange={handleChange2}
              onRemove={onRemove2}
              accept=".bmp,.gif,.png,.jpeg,.jpg"
            >
              {uploadButton}
            </Upload>
          )}
        </Form.Item>
        <Form.Item label="活动说明" name="content">
          {isDetail ? (
            <span>{editingItem?.content || '--'}</span>
          ) : (
            <Input.TextArea placeholder="请输入" />
          )}
        </Form.Item>
      </Form>
      <h1>活动商品</h1>
      {!isDetail && (
        <Button 
          type='primary' 
          onClick={() => {
            setModalVisible(true);
          }}>
          选择商品
        </Button>
      )}
      <div className={'container-table-body'} style={{marginTop: 10}}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={chooseColumns}
          rowKey={'id'}
          dataSource={choosedProducts}
          pagination={false}
        />
      </div>
      <Space style={{marginTop: 10}}>
        <Button type="primary" onClick={() => {addOrUpdate(0)}}>上架</Button>
        <Button onClick={() => {addOrUpdate(2)}}>暂存</Button>
        <Button>返回</Button>
      </Space>
      {useModal()}
    </PageContainer>
  );
};
