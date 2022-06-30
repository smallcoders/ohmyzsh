import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Form, Input, Table, Upload, Space, message, Popconfirm, Modal, Breadcrumb, Image, InputNumber } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import type { ColumnsType } from 'antd/lib/table';
import { UploadFile } from 'antd/lib/upload/interface';
import SelfTable from '@/components/self_table';
import {
  getActivityProducts,
  createActivity, // 新增活动
  updateActivity, // 编辑活动
  getActivityDetail, // 活动详情
  getProductPriceList, // 设置价格时查看对应商品规格信息
} from '@/services/purchase';
import moment from 'moment';
import React, { useState, useEffect, useRef, useContext } from 'react';
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
      const { id, isDetail } = history.location.query as { id: string | undefined, isDetail: string | undefined };
      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getActivityDetail(id);
        let editItem = { ...detailRs.result };
        console.log(editItem, '---editItem')
        if (detailRs.code === 0) {
          let actImgs:any = [];
          // 已选商品数据回显
          if(editItem.product) {
            setChoosedProducts(editItem.product);
          }
          if(editItem.otherPic) {
            editItem.otherPic.map((i: any) => {
              actImgs.push(
                {
                  uid: i.picId,
                  name: 'image.png',  
                  status: 'done',
                  url: i.banner
                }
              )
            }) 
          }
          setEditingItem({
            ...editItem, 
            time: [moment(editItem.startTime), moment(editItem.endTime)],
            firstPic: [{uid: editItem.firstPic?.picId,name: 'image.png',  status: 'done',url: editItem.firstPic?.banner}],
            otherPic: actImgs
          });
          setFiles([
            {
              picId: editItem.firstPic?.picId,
              banner: editItem.firstPic?.banner
            }
          ]);
          if(editItem.otherPic) {
            setFiles2(editItem.otherPic)
          }
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
      if(isDetail == '1') {
        setIsDetail(true);
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  // 额外的副作用 用来解决表单的设置
  useEffect(() => {
    form.setFieldsValue({ ...editingItem });
  }, [editingItem]);

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
            <a
              href="#"
              onClick={() => {
                history.push(`/purchase-manage/commodity-detail?id=${record.id}`);
              }}
            >
              详情
            </a>
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

  const getProductPrices = async (id: string, index: number) => {
    setCurrentSetIndex(index); //保存当前修改商品的index
    try {
      const res = await getProductPriceList(id);
      if (res.code === 0) {
        setPriceDataSource(res.result);
      } else {
        message.error(`请求分页数据失败`);
      }
      setPriceModalVisible(true);
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
  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
    // const isLt2M = e.file.size / 1024 / 1024 < 2;
    // console.log('Upload event:', e);
    // if (Array.isArray(e)) {
    //   return e;
    // }
    // if (!isLt2M) {
    //   message.error('视频大小不得超过800M!');
    //   return []
    // }
    // return e?.fileList;
  };
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

  // --------------------选择商品弹框开始------------------
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [choosedProducts, setChoosedProducts] = useState<any>([]); //已选商品数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
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
  const [weightForm] = Form.useForm();
  // 权重设置
  const editSort = (value: number, index: number) => {
    let arr = JSON.parse(JSON.stringify(choosedProducts))
    arr[index].sortNo = value;
    setChoosedProducts(arr);
  }
  const remove = (index: number) => {
    let arr = JSON.parse(JSON.stringify(choosedProducts)).splice(index, 1);
    setChoosedProducts(arr);
  }
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
      dataIndex: 'sortNo',
      width: 180
    },
    {
      title: '操作',
      width: 240,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any, index: number) => {
        return (
          <Space size="middle">
            <a
              href="#"
              onClick={() => {
                history.push(`/purchase-manage/commodity-detail?id=${record.id}`);
              }}
            >
              商品详情
            </a>
            <a
              href="#"
              onClick={() => {
                getProductPrices(record.id, index);
              }}
            >
              设置价格
            </a>
            <Popconfirm
              title={
                <>
                  <Form form={weightForm}>
                    <Form.Item 
                      name={'weight'} 
                      label="权重设置">
                      <InputNumber min={1} max={100} placeholder="请输入1-100的整数，数字越大排名越小" />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<PlusOutlined style={{ display: 'none' }} />}
              okText="确定"
              cancelText="取消"
              onConfirm={() => {
                editSort(weightForm.getFieldValue('weight'), index)
              }}
            >
              <Button
                key="1"
                size="small"
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({weight: record.sort})
                }}
              >
                权重设置
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              cancelText="取消"
              onConfirm={() => remove(index)}
            >
              <a href="#">删除</a>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  
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
  // --------------------选择商品弹框结束------------------

  //  --------------------设置价格弹框开始------------------
  const [priceModalVisible, setPriceModalVisible] = useState<boolean>(false);
  const [priceDataSource, setPriceDataSource] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(-1);
  const setPriceOk = async () => {
    // 校验商品销售价是否全部填了
    console.log(currentSetIndex, 'currentSetIndex');
    console.log(priceDataSource, 'priceDataSource');
    console.log(choosedProducts, 'choosedProducts');
    let arr = [...choosedProducts];
    let list = arr.map((item,index)=>
      index == currentSetIndex ? {...item, specs: priceDataSource} : item
    );
    console.log(list);
    setChoosedProducts(list)
    setPriceModalVisible(false);
  };
  const cancelSetPrice = () => {
    setPriceModalVisible(false);
  };
  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);

    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };

    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };

    let childNode = children;

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          // rules={[
          //   {
          //     required: true,
          //     message: `${title}必填.`,
          //   },
          // ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

  const defaultColumns = [
    {
      title: '规格名',
      dataIndex: 'specsTitle',
      width: '30%',
    },
    {
      title: '规格值',
      dataIndex: 'specs',
    },
    {
      title: '商品采购价（元）',
      dataIndex: 'purchasePrice',
    },
    {
      title: '商品销售价（元）',
      dataIndex: 'salePrice',
      editable: true,
      render: (_: number, record: any) => _ || 0
    },
    {
      title: '商品划线价（元）',
      dataIndex: 'originPrice',
      editable: true,
      render: (_: number, record: any) => _ || 0
    }
  ];

  const handleSave = (row: any) => {
    const newData = [...priceDataSource];
    console.log(row.id, row);
    const index = newData.findIndex((item) => row.id === item.id);
    console.log(index);
    // console.log(index, 121212);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    console.log(newData, 'handleSave后的数据');
    setPriceDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const priceColumns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  
  const setPriceModal = (): React.ReactNode => {
    return (
      <Modal
        title={ '配置商品活动价'}
        width="800px"
        visible={priceModalVisible}
        onOk={setPriceOk}
        onCancel={cancelSetPrice}
        footer={[
          <Button key="back" onClick={cancelSetPrice}>
            取消
          </Button>,
          <Button
            key="link"
            type="primary"
            onClick={setPriceOk}
          >
            确定
          </Button>,
        ]}
      >
        <div className={'container-table-body'} style={{marginTop: 10}}>
          <div style={{ marginBottom: 16 }}>
            商品名称？？？？？？
          </div>
          <Table
            components={components}
            rowKey={'id'}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={priceDataSource}
            columns={priceColumns}
          />
        </div>
      </Modal>
    );
  };

  /**
   * 新增/编辑
   */
  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);
  const addOrUpdate = (addedState: number) => {
    form
      .validateFields()
      .then(async (value: any) => {
        const tooltipMessage = editingItem.id ? '活动编辑' : '活动新增';
        const hide = message.loading(`正在${tooltipMessage}`);
        console.log({
          ...value,
          startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
          firstPic: files,
          otherPic: files2,
          sortNo: value.sortNo ? Number(value.sortNo) : null,
          product: choosedProducts || []
        });
        setAddOrUpdateLoading(true);
        // // 编辑
        let addorUpdateRes = {};
        if(editingItem.id) {
          addorUpdateRes = await updateActivity({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            firstPic: files,
            otherPic: files2,
            sortNo: value.sortNo ? Number(value.sortNo) : null,
            addedState: addedState,
            product: choosedProducts || [],
            id: editingItem.id
          });
          hide()
        }else {
          addorUpdateRes = await createActivity({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            firstPic: files,
            otherPic: files2,
            sortNo: value.sortNo ? Number(value.sortNo) : null,
            addedState: addedState,
            product: choosedProducts || []
          });
          hide();
        }
        if (addorUpdateRes.code === 0) {
          message.success(`${tooltipMessage}成功`);
          // setIsClosejumpTooltip(false);
          history.push(`/purchase-manage/promotions-manage`);
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
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
        <Form.Item label="活动开始时间" name="time" rules={[{ required: !isDetail }]}>
          {isDetail ? (
            <span>{editingItem?.startTime + '~' + editingItem?.endTime || '--'}</span>
          ) : (
            <DatePicker.RangePicker
              // format="YYYY-MM-DD HH:mm:ss"
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
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={`${!isDetail ? '图片格式仅支持JPG、PNG、JPEG,建议尺寸XXXX*XXXX，大小在5M以下' : ''}`}
        >
          {isDetail ? (
            <Image height={200} width={300} src={editingItem.firstPic?.banner} />
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
          valuePropName="fileList"
          getValueFromEvent={normFile}
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
        {!isDetail && (
          <>
            <Button type="primary" loading={addOrUpdateLoading} onClick={() => {addOrUpdate(0)}}>上架</Button>
            <Button loading={addOrUpdateLoading} onClick={() => {addOrUpdate(2)}}>暂存</Button>
          </>
        )}
        <Button loading={addOrUpdateLoading} onClick={() => {history.push(`/purchase-manage/promotions-manage`);}}>返回</Button>
      </Space>
      {useModal()}
      {setPriceModal()}
    </PageContainer>
  );
};
