import { pageQuery, modifySortNo, modifyTags } from '@/services/order/order-manage';
import { getApplicationTypeList } from '@/services/digital-application';
import {DownOutlined} from "@ant-design/icons";
import { PageContainer } from '@ant-design/pro-layout';
import { Access, useAccess } from 'umi';
import './index.less'
import { Button, Dropdown, Menu, Popconfirm, Form, InputNumber, message, Cascader, Row, Col, Input, Select, TreeSelect, Image, Tag } from 'antd';
const { Option } = Select;
const { CheckableTag } = Tag;
import { useCallback, useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import SelfTable from '@/components/self_table';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('page-goods-list');
// 商品来源字典
const productSourceType = {
  0:'采购商品', 
  1:'应用商品', 
  2:'其他商品'
}
// 商品服务端
const appTypeObj = {
  0:'App端', 
  1:'Web端', 
  3:'App端、Web端'
}
// 标签数据
const tagsData = [
  {name: '消费券', value: 1},
  {name: '平台优选', value: 2},
  {name: '行业精选', value: 3},
  {name: 'App预置', value: 4}
]
export default () => {
  const history = useHistory();
  const [columnData, setColumnData] = useState<any>({})
  const [activeStatusData, setActiveStatusData] = useState({});
  const [applicationTypeList, setApplicationTypeList] = useState<any>([]);
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<any>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const [searchContent, setSearChContent] = useState<any>({});
  const [dataSource, setDataSource] = useState<any>([]);
  const [weightForm] = Form.useForm();
  const [goodsTypeForm] = Form.useForm()
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  const getSearchQuery = () => {
    const search = searchForm.getFieldsValue();
    console.log(search)
    return search;
  };

  const getPages = async(pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code, totalCount, pageTotal } = await pageQuery({
        current: pageIndex,
        pageSize,
        ...searchContent
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
  }

  const goDetail = useCallback(
    (record: { id: number }) => {
      window.open(`/goods-manage/goods_manage/detail?id=${record.id}`);
    },
    [history],
  );

  const handleChange = (tag: number, checked: boolean) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
  };
  const handleModifyTags = async () => {
    const res = await modifyTags({
      productId: columnData.id,
      tagId: selectedTags
    })
    if(res.code === 0) {
      message.success(`编辑标签成功！`);
      setSelectedTags([])
      getPages()
    } else {
      message.error(res.message)
    }
  }

  // 编辑权重
  const editSort = async (id: string, value: number) => {
    const editRes = await modifySortNo({
      id: id,
      sortNo: value,
    });
    if (editRes.code === 0) {
      message.success(`编辑权重成功！`);
      weightForm.resetFields()
      getPages()
    } else {
      message.error(`编辑权重失败，原因:{${editRes.message}}`);
    }
  };
  // 上/下架
  const upOrDown = async (value: number) => {
    const editRes = await modifySortNo({
      id: columnData.id,
      saleStatus: value,
    });
    if (editRes.code === 0) {
      message.success(`${value == 1 ? '上架成功！' : '下架成功！'}`);
      weightForm.resetFields()
      getPages()
    } else {
      message.error(`${value == 1 ? '上架' : '下架'}失败，原因:{${editRes.message}}`);
    }
  };
  // 类型修改
  const modifyType = async (value: number) => {
    const editRes = await modifySortNo({
      id: columnData.id,
      appTypeId: value[1],
    });
    if (editRes.code === 0) {
      message.success(`类型修改成功！`);
      goodsTypeForm.resetFields()
      getPages()
    } else {
      message.error(`类型修改失败，原因:{${editRes.message}}`);
    }
  };

  const handleGetApplicationTypeList = () => {
    getApplicationTypeList().then(({ result }) => {
      setApplicationTypeList(result || []);
    });
  };

  useEffect(() => {
    getPages()
  }, [searchContent])

  const columns = [
    {
      title: '权重',
      hideInSearch: true,
      dataIndex: 'sortNo'
    },
    {
      title: '商品名称',
      dataIndex: 'productName',
      render: (text: string, record: any) => {
        return (
          <div className='product-info'>
            <Image src={record.productPic} />
            <div>
              <h3 onClick={() => goDetail(record)}>{text}</h3>
              <p title={record.productDesc}>{record.productDesc}</p>
            </div>
          </div>
        )
      }
    },
    {
      title: '商品来源',
      dataIndex: 'productSource',
      render: (_: number) => {
        return <div>{productSourceType[_]}</div>
      }
    },
    {
      title: '商品类型',
      dataIndex: 'appTypeName'
    },
    {
      title: '所属组织',
      dataIndex: 'providerName'
    },
    {
      title: '价格区间',
      dataIndex: 'minSalePrice',
      render: (text: any, record: any) => record.minSalePrice + '~' + record.maxSalePrice,
    },
    {
      title: '商品状态',
      dataIndex: 'saleStatus',
      width: 96,
      render: (text: number) => text == 0 ? '已下架' : '发布中'
    },
    {
      title: '所属标签',
      dataIndex: 'productTagNames'
    },
    {
      title: '商品服务端',
      dataIndex: 'appType',
      width: 144,
      render: (_: number) => <div>{appTypeObj[_]}</div>
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      render: (_: any, record: any) => (
        <>
          <Button size="small" type="link" onClick={() => goDetail(record)}>
            详情
          </Button>
          <Access accessible={access['PU_DG_SPGL']}>
            <Popconfirm
              title={
                <>
                  <Form form={weightForm}>
                    <Form.Item name={'weight'} label="请输入权重"
                      validateTrigger="onBlur"
                      rules={[
                        {
                          validator: (_, value) => {
                            console.log(_, value)
                            if(!value) {
                              return Promise.resolve()
                            }
                            if (value < 1 || value > 100) {
                              return Promise.reject(new Error('允许输入权重数字范围为1～100'))
                            } else if (/^\d+\.\d{4,}/.test(value)) {
                              return Promise.reject(new Error('小数点后最多取三位'))
                            }
                            return Promise.resolve()
                          },
                        },
                      ]}
                    >
                      <InputNumber style={{width: '216px'}} placeholder='数字越大排序越靠前' />
                    </Form.Item>
                  </Form>
                </>
              }
              icon={<DownOutlined style={{ display: 'none' }} />}
              okText="确定"
              cancelText="取消"
              onConfirm={async () => {
                await weightForm.validateFields()
                editSort(record.id, weightForm.getFieldValue('weight') || 1);
              }}
            >
              <Button
                key="1"
                size="small"
                type="link"
                onClick={() => {
                  weightForm.setFieldsValue({ weight: record.sortNo });
                }}
              >
                权重
              </Button>
            </Popconfirm>
            <Dropdown overlay={moreMenu} trigger={['click']}>
              <a className="ant-dropdown-link" onClick={()=>{handleMoreMenuClick(record as any)}}>
                更多 <DownOutlined />
              </a>
            </Dropdown>
          </Access>
        </>
      ),
    },
  ];
  const access = useAccess()
  const moreMenu = (
    <Menu >
      <Menu.Item key={'1'}>
        <Popconfirm
          title={
            <div>
              <p>请选择将要给该组织标注的标签：</p>
              {tagsData.map((tag: any) => (
                <div style={{marginBottom: 8}}>
                  <CheckableTag
                    key={tag.value}
                    checked={selectedTags.includes(tag.value)}
                    onChange={(checked) => handleChange(tag.value, checked)}
                  >
                    {tag.name}
                  </CheckableTag>
                </div>
              ))}
            </div>
          }
          icon={<DownOutlined style={{ display: 'none' }} />}
          okText="确定"
          cancelText="取消"
          onCancel={() => {
            setSelectedTags([])
          }}
          onConfirm={() => {
            handleModifyTags()
          }}
        >
          <a
            href="#"
            onClick={() => {
            }}
          >标签</a>
        </Popconfirm>
      </Menu.Item>
      {activeStatusData==1&&
      <Menu.Item key={'2'}>
        <Popconfirm
          title="确认下架？"
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
          okText="下架"
          cancelText="取消"
          onConfirm={() => {
            upOrDown(0)
          }}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >下架</a>
        </Popconfirm>
      </Menu.Item>}
      {activeStatusData==0&&
      <Menu.Item key={'3'}>
        <Popconfirm
          title="确认上架？？"
          overlayStyle={{translate:'10px 40px'}}
          placement="topRight"
          okText="上架"
          cancelText="取消"
          onConfirm={() => {
            upOrDown(1)
          }}
        >
        <a
          href="#"
          onClick={() => {
          }}
        >上架</a>
        </Popconfirm>
      </Menu.Item>}
      <Menu.Item key={'4'}>
      <Popconfirm
        overlayStyle={{translate:'10px 40px', zIndex: 999}}
        title={
          <>
            <Form form={goodsTypeForm}>
              <Form.Item name={'goodsType'} label="商品类型"
                validateTrigger="onBlur"
              >
                <Cascader
                  changeOnSelect
                  style={{ width: '200px' }}
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                  options={applicationTypeList}
                  placeholder="请选择"
                  getPopupContainer={(trigger) => trigger as HTMLElement}
                />
              </Form.Item>
            </Form>
          </>
        }
        icon={<DownOutlined style={{ display: 'none' }} />}
        okText="确定"
        cancelText="取消"
        onConfirm={async () => {
          await goodsTypeForm.validateFields()
          modifyType(goodsTypeForm.getFieldValue('goodsType'));
        }}
      >
        <a
          href='#'
          onClick={() => {
            goodsTypeForm.setFieldsValue({ goodsType: columnData.deepTypeId && columnData.deepTypeId.split(',').map(parseFloat) });
          }}
        >
          类型修改
        </a>
      </Popconfirm>
      </Menu.Item>
    </Menu>
  );
  useEffect(() => {
    handleGetApplicationTypeList()
  }, []);
  const formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 16 },
  };
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="productName" label="商品名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="productTypes" label="商品类型">
                <TreeSelect
                  showSearch
                  treeNodeFilterProp="name"
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={applicationTypeList}
                  placeholder="请选择"
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orgName" label="所属组织">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="productSource" label="商品来源">
                <Select placeholder="请选择">
									<Option value={1} key='1'>应用商品</Option>
                  <Option value={2} key='2'>其他商品</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item name="saleStatus" label="商品状态">
                <Select placeholder="请选择">
                  <Option value={1} key='1'>发布中</Option>
									<Option value={0} key='2'>已下架</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="productTag" label="所属标签">
                <Select placeholder="请选择">
                  <Option value={1} key='1'>消费券</Option>
									<Option value={2} key='2'>平台优选</Option>
                  <Option value={3} key='3'>行业精选</Option>
                  <Option value={4} key='4'>App预置</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="appType" label="商品服务端">
                <Select placeholder="请选择">
                  <Option value={1} key='1'>Web端</Option>
									<Option value={0} key='2'>App端</Option>
                  <Option value={3} key='2'>App端、Web端</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col offset={2} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  if(search.productTypes) {
                    search.productTypes = [search.productTypes]
                  }
                  setPageInfo({...pageInfo, pageIndex: 1})
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                key="reset"
                onClick={() => {
                  searchForm.resetFields();
                  setPageInfo({...pageInfo, pageIndex: 1})
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
  //更多下拉
  const handleMoreMenuClick=(record: any)=> {
    setActiveStatusData(record.saleStatus)
    setColumnData(record)
    if(record && record.productTagIds) {
      setSelectedTags(record.productTagIds.split(',').map(parseFloat))
    }
  }
  return (
    <PageContainer>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>商品列表（共{pageInfo.totalCount || 0}个）</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
          columns={columns}
          dataSource={dataSource}
          pagination={
            pageInfo.totalCount === 0
              ? false
              : {
                onChange: getPages,
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
