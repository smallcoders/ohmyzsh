import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Table,
  Upload,
  Space,
  message,
  Popconfirm,
  Modal,
  Breadcrumb,
  Image,
  InputNumber,
  Pagination,
} from 'antd';
import type { TableRowSelection } from 'antd/lib/table/interface';
import type { UploadChangeParam } from 'antd/lib/upload';

import type { ColumnsType } from 'antd/lib/table';
import type { UploadFile } from 'antd/lib/upload/interface';
import SelfTable from '@/components/self_table';
import type { PaginationProps } from 'antd';
import {
  getActivityAppProducts,
  createActivity, // 新增活动
  updateActivity, // 编辑活动
  getActivityDetail, // 活动详情
  getProductPriceList, // 设置价格时查看对应商品规格信息
} from '@/services/purchase';
import moment from 'moment';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, history, Prompt } from 'umi';
import { routeName } from '../../../../config/routes';
import './detail.less';
const RangePicker: any = DatePicker.RangePicker;

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
  isEllipsis: boolean;
}

export default () => {
  const [editingItem, setEditingItem] = useState<any>({});
  const isEditing = Boolean(editingItem.id);

  /**
   * 关闭提醒 主要是 添加或者修改成功后 不需要弹出
   */
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);

  const prepare = async () => {
    try {
      const { id } = history.location.query as { id: string | undefined };
      if (id) {
        // 获取详情 塞入表单
        const detailRs = await getActivityDetail(id);
        const editItem = { ...detailRs.result };
        // console.log(editItem, '---editItem')
        if (detailRs.code === 0) {
          const actImgs: any = [];
          // 已选商品数据回显
          if (editItem.product) {
            setChoosedProducts(editItem.product);
          }
          if (editItem.otherPic) {
            editItem.otherPic.map((i: any) => {
              actImgs.push({
                uid: i.picId,
                name: 'image.png',
                status: 'done',
                url: i.banner,
              });
            });
          }
          setEditingItem({
            ...editItem,
            time: [moment(editItem.startTime), moment(editItem.endTime)],
            firstPic:
              editItem.firstPic && editItem.firstPic.id
                ? [
                    {
                      uid: editItem.firstPic?.picId,
                      name: 'image.png',
                      status: 'done',
                      url: editItem.firstPic?.banner,
                    },
                  ]
                : [],
            otherPic: actImgs,
          });

          if (editItem.otherPic) {
            setFiles2(editItem.otherPic);
          }
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
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
  const [dataSource, setDataSource] = useState<any>([]); //可选商品数据
  const [showDataSource, setShowDataSource] = useState<any>([]); //当前页显示的数据
  // 额外的副作用 用来解决表单的设置
  useEffect(() => {
    form.setFieldsValue({ ...editingItem });
  }, [editingItem]);

  const getProducts = async (pageIndex: number = 1, pageSize = 10) => {
    try {
      const { result, totalCount, pageTotal, code } = await getActivityAppProducts({
        pageIndex,
        pageSize,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize: 5 });
        setDataSource(result);
        setShowDataSource(
          result.slice((pageIndex - 1) * pageInfo.pageSize, pageIndex * pageInfo.pageSize),
        );
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const columns: ColumnsType<DataType> = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
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
      render: (_: string) => <Image width={100} src={_} />,
      width: 120,
    },
    {
      title: '商品型号',
      dataIndex: 'productModel',
      width: 120,
    },
    {
      title: '商品采购价',
      dataIndex: 'originPricePart',
      width: 80,
    },
    {
      title: '商品销售价',
      dataIndex: 'salePricePart',
      // isEllipsis: true,
      width: 280,
    },
    {
      title: '商品划线价',
      dataIndex: 'originPricePart',
      width: 100,
    },
    {
      title: '权重',
      dataIndex: 'videoStatus',
      width: 180,
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
              href="#!"
              onClick={(e) => {
                e.preventDefault();
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

  const getProductPrices = async (id: string, index: number, name: string) => {
    setCurrentSetIndex(index); //保存当前修改商品的index
    setCurrentProductName(name); //保存当前修改商品的名称
    setIsClosejumpTooltip(false);
    try {
      const res = await getProductPriceList(id);
      if (res.code === 0) {
        // 返回的三种价格为分，处理为元
        const arr = [...res.result];
        arr.map((item: any) => {
          item.purchasePrice = item.purchasePrice ? item.purchasePrice / 100 : 0;
          item.salePrice = item.salePrice ? item.salePrice / 100 : 0;
          item.originPrice = item.originPrice ? item.originPrice / 100 : 0;
        });
        setPriceDataSource(arr);
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

  const [files2, setFiles2] = useState<any>([]); // 活动图
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  const normFile = (e: any) => {
    const isLt5M = e.file.size / 1024 / 1024 < 5;
    if (Array.isArray(e)) {
      return e;
    }
    if (!isLt5M) {
      message.error('视频大小不得超过5M!');
      return [];
    }
    return e?.fileList;
  };

  const handleChange2 = (info: UploadChangeParam<UploadFile<any>>) => {
    if (info.file.status === 'done') {
      const uploadResponse = info?.file?.response;
      if (uploadResponse?.code === 0 && uploadResponse.result) {
        const upLoadResult = info?.fileList.map((p) => {
          return {
            picId: p.response?.result?.id,
            banner: p.response?.result?.path,
          };
        });
        // console.log(upLoadResult, '上传成功后的结果');
        setFiles2(upLoadResult);
      } else {
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };
  const onRemove2 = (file: UploadFile<any>) => {
    // debugger

    const files_copy = [...files2];
    const existIndex = files_copy.findIndex((p) => p.picId === file?.response?.result?.id);
    if (existIndex > -1) {
      files_copy.splice(existIndex, 1);
      // console.log(files_copy, '删除图片后的结果');
      setFiles2(files_copy);
    }
  };
  const beforeUpload = () => {
    if (files2.length == 3) {
      message.error('活动图最多可上传3张！');
    }
  };

  // --------------------选择商品弹框开始------------------
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [choosedProducts, setChoosedProducts] = useState<any>([]); //已选商品数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const handleOk = async () => {
    const arr: any = [];
    if (selectedRowKeys) {
      selectedRowKeys.map((i: any) => {
        arr.push(JSON.parse(i));
      });
    }
    const list = choosedProducts.concat(arr);
    const res: any = [];
    list.forEach((item: any) => {
      const flag = res.some((e: any) => {
        if (item.id === e.id) {
          return true;
        }
      });
      if (!flag) {
        res.push(item);
      }
    });
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
    weightForm
      .validateFields()
      .then(() => {
        const arr = JSON.parse(JSON.stringify(choosedProducts));
        arr[index].sortNo = value;
        setChoosedProducts(arr);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const remove = (index: number) => {
    const arr = JSON.parse(JSON.stringify(choosedProducts)).filter((item: any, i: number) => {
      // console.log(i, index);
      return i != index;
    });
    setChoosedProducts(arr);
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
      render: (_: string) => <Image width={100} src={_} />,
      width: 120,
    },
    {
      title: '商品型号',
      dataIndex: 'productModel',
      width: 120,
    },
    {
      title: '商品采购价',
      dataIndex: 'originPricePart',
      width: 80,
    },
    {
      title: '商品销售价',
      dataIndex: 'salePricePart',
      width: 280,
    },
    {
      title: '商品划线价',
      dataIndex: 'originPricePart',
      width: 100,
    },
    {
      title: '权重',
      dataIndex: 'sortNo',
      width: 180,
    },
    {
      title: '操作',
      width: 270,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any, index: number) => {
        return (
          <Space size="small">
            <Button
              type="link"
              style={{ padding: 0 }}
              onClick={() => {
                history.push(
                  `/purchase-manage/commodity-detail?id=${record.id || record.productId}`,
                );
              }}
            >
              商品详情
            </Button>
            <a
              href="#!"
              onClick={() => {
                getProductPrices(record.id || record.productId, index, record.productName);
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
                      label="权重设置"
                      rules={[
                        {
                          validator(rule, value) {
                            const r = /^100$|^(?:\d|[1-9]\d|1[0-4]\d)?$/.test(value);
                            if (!r) {
                              return Promise.reject('请输入1-100的整数');
                            } else {
                              return Promise.resolve();
                            }
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        min={1}
                        max={100}
                        placeholder="请输入1-100的整数，数字越大排名越小"
                      />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<PlusOutlined style={{ display: 'none' }} />}
              okText="确定"
              placement="topRight"
              cancelText="取消"
              onConfirm={() => {
                editSort(weightForm.getFieldValue('weight'), index);
              }}
            >
              <Button
                key="1"
                size="small"
                style={{ padding: 0 }}
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({ weight: record.sort });
                }}
              >
                权重设置
              </Button>
            </Popconfirm>
            <Popconfirm
              title="确定删除么？"
              okText="确定"
              placement="topRight"
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
      // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection: TableRowSelection<DataType> = {
      preserveSelectedRowKeys: true, // 设置翻页保存key
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        {
          key: 'id',
          text: '全选所有',
          onSelect: () => {
            const arr: any = [];
            dataSource.map((item: any) => {
              arr.push(JSON.stringify(item));
            });
            setSelectedRowKeys(arr);
          },
        },
      ],
    };
    const changePage: PaginationProps['onChange'] = (page) => {
      setPageInfo({ ...pageInfo, pageIndex: page });
      const arr: any = [];
      const start = (page - 1) * pageInfo.pageSize;
      const end = start + pageInfo.pageSize;
      dataSource.map((item: any, index: number) => {
        if (index >= start && index < end) {
          arr.push(item);
        }
      });
      console.log(arr, 'arr');
      setShowDataSource([...arr]);
    };

    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Modal
        title={'选择商品'}
        width="800px"
        open={modalVisible}
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
        <div className={'container-table-body'} style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 16 }}>
            <span style={{ marginLeft: 8 }}>
              {hasSelected ? `已选商品：${selectedRowKeys.length}` : ''}
            </span>
          </div>
          <Table
            bordered
            scroll={{ x: 1400 }}
            // rowKey={'id'}
            rowKey={(r: any) => {
              return JSON.stringify(r);
            }}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={showDataSource}
            pagination={false}
          />
          <Pagination
            style={{ marginTop: 10 }}
            current={pageInfo.pageIndex}
            onChange={changePage}
            total={pageInfo.totalCount}
            pageSize={pageInfo.pageSize}
          />
          {/* <Table
            bordered
            scroll={{ x: 1400 }}
            rowKey={(r: any) => {return JSON.stringify(r)}}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={showDataSource}
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
          /> */}
        </div>
      </Modal>
    );
  };
  // --------------------选择商品弹框结束------------------

  //  --------------------设置价格弹框开始------------------
  const [priceModalVisible, setPriceModalVisible] = useState<boolean>(false);
  const [priceDataSource, setPriceDataSource] = useState<Record<string, any>[]>([]);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(-1);
  const [currentProductName, setCurrentProductName] = useState<string>('');
  const setPriceOk = async () => {
    // 校验商品销售价是否全部填了,且三种价格都要*100
    // 销售价格及划线价不能为负数
    // console.log(priceDataSource, 'priceDataSource');
    const price = [...priceDataSource];
    for (let i = 0; i < price.length; i++) {
      if (price[i].salePrice == 0 || !price[i].salePrice) {
        message.error('商品销售价必填！');
        return false;
      }
      if (price[i].salePrice * 1 < 0 || (price[i].originPrice && price[i].originPrice * 1 < 0)) {
        message.error('售价不能为负数！');
        return false;
      }
    }
    // 获取所选商品的销售价及划线价的价格区间
    const salePriceArr: any = [];
    const originPriceArr: any = [];
    price.map((item: any) => {
      salePriceArr.push(item.salePrice * 1);
      originPriceArr.push(item.originPrice * 1);
    });
    console.log(salePriceArr, originPriceArr);
    const maxSalePrice = Math.max.apply(null, salePriceArr);
    const minSalePrice = Math.min.apply(null, salePriceArr);
    const maxOriginPrice = Math.max.apply(null, originPriceArr);
    const minOriginPrice = Math.min.apply(null, originPriceArr);
    // 价格处理为分，*100
    price.map((item: any) => {
      item.purchasePrice = item.purchasePrice * 100;
      item.salePrice = item.salePrice * 100;
      item.originPrice = item.originPrice ? item.originPrice * 100 : 0;
    });
    // console.log(price, 'price');
    const arr = [...choosedProducts];
    const list = arr.map((item, index) =>
      index == currentSetIndex
        ? {
            ...item,
            specs: priceDataSource,
            salePricePart: minSalePrice.toFixed(2) + '~' + maxSalePrice.toFixed(2),
            originPricePart:
              maxOriginPrice != 0
                ? minOriginPrice.toFixed(2) + '~' + maxOriginPrice.toFixed(2)
                : null,
          }
        : item,
    );
    // console.log(list);
    setChoosedProducts(list);
    setPriceModalVisible(false);
  };
  const cancelSetPrice = () => {
    setPriceModalVisible(false);
  };
  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }: any) => {
    const [editableForm] = Form.useForm();
    return (
      <Form form={editableForm} component={false}>
        <EditableContext.Provider value={editableForm}>
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
  }: any) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const editableCellForm = useContext<any>(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current?.focus();
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
        const values = await editableCellForm.validateFields();
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
      width: '20%',
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
      render: (_: number) => _ || 0,
    },
    {
      title: '商品划线价（元）',
      dataIndex: 'originPrice',
      editable: true,
      render: (_: number) => _ || 0,
    },
  ];

  const handleSave = (row: any) => {
    const newData = [...priceDataSource];
    const index = newData.findIndex((item: any) => row.id === item.id);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    // console.log(newData, 'handleSave后的数据');
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
      onCell: (record: Record<string, string>) => ({
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
        title={'配置商品活动价'}
        width="800px"
        open={priceModalVisible}
        maskClosable={false}
        onOk={setPriceOk}
        onCancel={cancelSetPrice}
        footer={[
          <Button key="back" onClick={cancelSetPrice}>
            取消
          </Button>,
          <Button key="link" type="primary" onClick={setPriceOk}>
            确定
          </Button>,
        ]}
      >
        <div className={'container-table-body'} style={{ marginTop: 10 }}>
          <div style={{ marginBottom: 16 }}>{currentProductName}</div>
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
        if (choosedProducts.length == 0) {
          message.warn('请选择活动商品！');
          return false;
        }
        const tooltipMessage = editingItem.id ? '活动编辑' : '活动新增';
        const hide = message.loading(`正在${tooltipMessage}`);

        setAddOrUpdateLoading(true);
        // // 编辑
        let addorUpdateRes: { code?: number; message?: string; result?: any } = {};
        if (editingItem.id) {
          addorUpdateRes = await updateActivity({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            otherPic: files2,
            sortNo: value.sortNo ? Number(value.sortNo) : null,
            addedState: addedState,
            product: choosedProducts || [],
            id: editingItem.id,
            type: 1, //活动类型   0-采购活动 1:数字化应用活动
          });
          hide();
        } else {
          addorUpdateRes = await createActivity({
            ...value,
            startTime: moment(value.time[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTime: moment(value.time[1]).format('YYYY-MM-DD HH:mm:ss'),
            otherPic: files2,
            sortNo: value.sortNo ? Number(value.sortNo) : null,
            addedState: addedState,
            product: choosedProducts || [],
            type: 1, //活动类型   0-采购活动 1:数字化应用活动
          });
          hide();
        }
        if (addorUpdateRes.code === 0) {
          setIsClosejumpTooltip(false);
          message.success(`${tooltipMessage}成功`);
          if (addedState === 0) {
            history.goBack(); // 上架返回上一页， 暂存 停留当前页
          }
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        message.error('缺少必填项');
        console.log(err);
      });
  };

  return (
    <PageContainer
      title={false}
      header={{
        title: isEditing ? `活动编辑` : '活动新增',
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to={routeName.SHELVES_MANAGE_INDEX}>活动管理 </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{isEditing ? `活动编辑` : '活动新增'}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
      footer={[
        <Popconfirm
          key="update"
          title="上架后，活动以及商品将展示在前台，确定上架"
          okText="上架"
          cancelText="取消"
          onConfirm={() => addOrUpdate(0)}
        >
          <Button type="primary" loading={addOrUpdateLoading}>
            上架
          </Button>
        </Popconfirm>,
        <Button
          key="add"
          loading={addOrUpdateLoading}
          onClick={() => {
            addOrUpdate(2);
          }}
        >
          暂存
        </Button>,
        <Button
          key="back"
          loading={addOrUpdateLoading}
          onClick={() => {
            history.goBack();
          }}
        >
          返回
        </Button>,
      ]}
    >
      <Prompt when={isClosejumpTooltip} message={'离开当前页后，所编辑的数据将不可恢复'} />
      <h1>活动基础信息</h1>
      <Form labelCol={{ span: 4 }} form={form}>
        <Form.Item label="活动编码" name="actNo" rules={[{ required: true }]}>
          <Input style={{ width: '300px' }} placeholder="请输入" maxLength={30} />
        </Form.Item>
        <Form.Item label="活动名称" name="name" rules={[{ required: true }]}>
          <Input style={{ width: '300px' }} placeholder="请输入" maxLength={8} />
        </Form.Item>
        <Form.Item label="活动时间" name="time" rules={[{ required: true }]}>
          <RangePicker
            // format="YYYY-MM-DD HH:mm:ss"
            showTime
            allowClear
          />
        </Form.Item>
        <Form.Item
          label="活动权重"
          name="sortNo"
          rules={[
            {
              validator(rule, value) {
                const r = /^100$|^(?:\d|[1-9]\d|1[0-4]\d)?$/.test(value);
                if (value) {
                  if (!r || value == 0) {
                    return Promise.reject('请输入1-100的整数');
                  } else {
                    return Promise.resolve();
                  }
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input
            style={{ width: '300px' }}
            placeholder="请输入1~100的整数，数字越大排名越靠前"
            type="number"
          />
        </Form.Item>
        <Form.Item label="活动促销词" name="actSpreadWord" rules={[{ required: true }]}>
          <Input style={{ width: '300px' }} placeholder="请输入" maxLength={30} />
        </Form.Item>

        <Form.Item
          label="活动图"
          name="otherPic"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={'图片格式仅支持JPG、PNG、JPEG,建议尺寸690*240px，大小在5M以下，支持3张图片'}
          rules={[{ required: true }]}
        >
          <Upload
            maxCount={3}
            listType="picture-card"
            action="/antelope-manage/common/upload/record"
            onChange={handleChange2}
            onRemove={onRemove2}
            beforeUpload={beforeUpload}
            accept=".bmp,.gif,.png,.jpeg,.jpg"
          >
            {uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="活动说明" name="content">
          <Input.TextArea
            style={{ width: '500px' }}
            placeholder="请输入"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
      <h1>活动商品</h1>
      <Button
        type="primary"
        onClick={() => {
          setModalVisible(true);
        }}
      >
        选择商品
      </Button>
      <div className={'container-table-body'} style={{ marginTop: 10 }}>
        <SelfTable
          bordered
          scroll={{ x: 1400 }}
          columns={chooseColumns}
          rowKey={'id'}
          dataSource={choosedProducts}
          pagination={false}
        />
      </div>
      {useModal()}
      {setPriceModal()}
    </PageContainer>
  );
};
