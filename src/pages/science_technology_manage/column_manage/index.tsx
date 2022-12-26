import {PageContainer} from "@ant-design/pro-layout";
import React, {useEffect, useState} from "react";
import {
  Button,
  Col,
  Form,
  Input,
  Tooltip,
  Drawer,
  Popconfirm,
  Row,
  Select,
  Space,
  Switch,
  Table, message,Dropdown,
  Menu,
} from "antd";
import './index.less';
import { Access, useAccess } from 'umi';
import scopedClasses from "@/utils/scopedClasses";
import {history} from "@@/core/history";
import { DownOutlined ,UploadOutlined} from '@ant-design/icons';
import {
  columnOffShelf,
  columnOnShelf,
  getClickPageDetailById,
  getColumnByPage, loanClickExport,
  removeColumn
} from "@/services/column-manage";
const sc = scopedClasses('column-manage');
enum Edge {
  HOME = 0, // 科产专栏
}
export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [clickId, setClickId] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [clickDataSource, setClickDataSource] = useState<any>([]);
  // 拿到当前角色的access权限兑现
  const access = useAccess()
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_SM_KCZL', // 科产管理-创新需求管理页面查询
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
  const [searchContent, setSearChContent] = useState<{
    name?: string; // 名称
    shelfStatus?: boolean; // 状态：true上架 false下架
  }>({});
  const [clickSearchContent, setClickSearchContent] = useState<{
    keyword?: string; // 姓名/手机号
    clientSource?: string; //浏览端
  }>({});

  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
  });
  const [clickPageInfo, setClickPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 1,
  });
  const [clickOpen, setClickOpen] = useState(false);
  const showDrawer = async (_record: any,e: any,pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setClickOpen(true);
    setClickId(_record)
    try{
      console.log(clickSearchContent)
      const data = {creativeColumnId:_record.id,pageSize,pageIndex,...e}
      const res =await getClickPageDetailById(data)
      const { result,totalCount,code }=res
      if(code===0){
        setClickDataSource(result)
        setClickPageInfo({ totalCount, pageIndex, pageSize });
      }else {
        message.error(`请求分页数据失败`);
      }
    }catch (err: any){
      console.log(err)
    }
  };

  const onClickClose = () => {
    setClickOpen(false);
  };

  //方法
  /*
  * 获取分页数据
  * @param pageIndex
  * @param pageSize
  * @param activeType
  */
  const getColumnList = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result,totalCount, code } = await getColumnByPage({
        pageIndex,
        pageSize,
        ...searchContent,
      })
      if (code === 0) {
        setDataSource(result)
        setPageInfo({ totalCount, pageIndex, pageSize });
      } else {
        message.error(`请求分页数据失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getColumnList();
  }, [searchContent]);

  //上下架
  const changeShelfStatus = async (shelfStatus: boolean,record: any) =>{
    console.log(shelfStatus,record)
    if(!shelfStatus){
      try {
        const res = await columnOnShelf({id:record.id})
        if(res.code==0){
          await  getColumnList()
          console.log(res)
        }
      }catch (e){

      }
    }else{
      try {
        const res = await columnOffShelf({id:record.id})
        if(res.code==0){
          await  getColumnList()
          console.log(res)
        }
      }catch (e){

      }
    }
  }

  //删除按钮
  const remove = async (record: any) =>{
    try {
      const res = await removeColumn(record.id)
      if (res.code === 0) {
        message.success(`删除成功`);
        await  getColumnList();
      } else {
        message.error(`删除失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  }
  const columns = [
    {
      title: '顺序序号',
      dataIndex: 'sort',
      key: 'sort',
      width:100,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '专栏名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '专栏介绍',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    access.P_SM_KCZL && {
      title: '上下架状态',
      key: 'shelfStatus',
      dataIndex: 'shelfStatus',
      width:120,
      render: (shelfStatus: boolean,_record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
          <Popconfirm
            title={
              (shelfStatus&&
                <div className="className">
                  <div>提示</div>
                  <div>是否下架</div>
                </div>)||  (!shelfStatus&&
                <div className="className">
                  <div>提示</div>
                  <div>是否上架</div>
                </div>)
            }
            okText="确定"
            cancelText="取消"
            onConfirm={()=>changeShelfStatus(shelfStatus,_record as any)}
          >
            <Switch checked={shelfStatus}  />
          </Popconfirm>
          </Access>
        )
      }
    },
    {
      title: '点击量',
      dataIndex: 'clickRate',
      key: 'clickRate',
      width:80,
      render: (clickRate: any,_record: any) => {
        return (
          <Tooltip placement="top" title={clickRate}>
            <a
              onClick={()=>{showDrawer(_record)}}
            >{clickRate}</a>
          </Tooltip>
        )
      }
    },
      access.P_SM_KCZL && {
      title: '操作',
      key: 'action',
      render: (_record: any) => {
        const accessible = access?.[permissions?.[edge].replace(new RegExp("Q"), "")]
        return (
          <Access accessible={accessible}>
          <Space size="middle">
            <a
              onClick={() => {
                history.push(`/science-technology-manage/column-manage/detail?id=${_record.id}`);
              }}
            >查看</a>
            <a
              onClick={() => {
                history.push(`/science-technology-manage/column-manage/edit?id=${_record.id}`);
              }}
            >编辑</a>
            <Popconfirm
              title="确定删除？"
              okText="确定"
              cancelText="取消"
              onConfirm={()=>{remove(_record)}}
            >
              <a>删除</a>
            </Popconfirm>
          </Space>
          </Access>
        )
      }
    }
  ].filter(p => p);
  const clickColumns = [
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '点击时间',
      dataIndex: 'clickTime',
    },
    {
      title: '浏览端',
      dataIndex: 'clientSource',
    },
  ];
  // const clickDataSource=[
  //   {key:1,name:'nihao',phone:'14234553425342',clickTime:1234,clientSource:'app端'},
  //   {key:2,name:'nihao1',phone:'542352345234',clickTime:54325,clientSource:'app端'},
  //   {key:3,name:'nihao2',phone:'54325534255',clickTime:53425,clientSource:'web端'},
  //   {key:4,name:'nihao3',phone:'53425234534',clickTime:53425423,clientSource:'web端'},
  // ]
  // const rowSelection = {
  //   getCheckboxProps: (record: any) => ({
  //     name: record.name,
  //   }),
  // };
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="name" label="专栏名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="shelfStatus" label="上下架状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={true}>上架</Select.Option>
                  <Select.Option value={false}>下架</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                style={{ marginRight: 20, marginLeft: 20 }}
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
  //点击量搜索区域
  const useClickSearchNode = (): React.ReactNode => {
    const [clickSearchClickForm] = Form.useForm();
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={clickSearchClickForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="keyword" >
                <Input placeholder="请输入姓名或手机号" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="clientSource" label="浏览端">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'WEB'}>WEB</Select.Option>
                  <Select.Option value={'APP'}>APP</Select.Option>
                  <Select.Option value={'WECHAT'}>WECHAT</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                style={{ marginRight: 20, marginLeft: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = clickSearchClickForm.getFieldsValue();
                  console.log(search)
                  setClickSearchContent(search);
                  showDrawer(clickId,search)
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
                onClick={() => {
                  clickSearchClickForm.resetFields();
                  setClickSearchContent({});
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
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const exportList = async (selected: boolean) => {
    if (selected && !selectedRowKeys.length) {
      message.warning('请选择数据');
      return;
    }
    try {
      let data = {};
      if (selected) {
        data = {creativeColumnId:clickId.id, idList: [...selectedRowKeys] };
      } else {
        data = { creativeColumnId:clickId.id,...clickSearchContent };
      }
      const res = await loanClickExport({ ...data });
      const content = res?.data;
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const fileName = '点击详情列表.xlsx';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        message.success(`导出成功`);
      }, 1000);
    } catch (error) {
      console.log(error);
      message.error(`导出失败`);
    }
  };

  const menuProps = (
    <Menu>
      <Menu.Item icon={<UploadOutlined />} onClick={() => exportList(false)}>
        导出筛选结果
      </Menu.Item>
      <Menu.Item icon={<UploadOutlined />} onClick={() => exportList(true)}>
        导出选中数据
      </Menu.Item>
    </Menu>
  );

  //点击量的抽屉面板
  const useClickDrawer = (): React.ReactNode => {
    return (
      <Drawer
        title="点击量"
        closable={true}
        width={720}
        onClose={onClickClose}
        visible={clickOpen}
        className={'column-manage-drawer'}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
           (
            <Space>
              <Button onClick={onClickClose}>取消</Button>
              <Button
                type="primary"
                onClick={() => {
                  onClickClose()
                }}
              >
                确定
              </Button>
            </Space>
          )
        }
        footerStyle={{ display: 'flex', justifyContent: 'end' }}
      >
        <div>
        {useClickSearchNode()}
          <Dropdown overlay={menuProps}>
            <Button size="large" style={{marginBottom:20}}>
              <Space>
                导出
                <DownOutlined />
              </Space>
            </Button>
          </Dropdown>

        {/*  <Button style={{marginBottom:'20px'}} icon={<UploadOutlined />} onClick={exportList}>*/}
        {/*  导出*/}
        {/*</Button>*/}
        <Table
          bordered
          rowKey={'id'}
          rowSelection={{
            fixed: true,
            selectedRowKeys,
            onChange: onSelectChange,
          }}

          columns={clickColumns}
          dataSource={clickDataSource}
          pagination={
            clickPageInfo.totalCount === 0
              ? false
              : {
                onChange: getColumnList,
                total: clickPageInfo.totalCount,
                current: clickPageInfo.pageIndex,
                pageSize: clickPageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${clickPageInfo.pageIndex}/${Math.ceil(clickPageInfo.totalCount / clickPageInfo.pageSize) || 1}页`,
              }
          }
        />
        </div>
      </Drawer>
    );
  };
  return(
    <PageContainer className={sc('container')}>
      <>
      {useSearchNode()}
      <div style={{ backgroundColor: '#fff', padding: 20 }}>
        <div className={sc('container-header')} style={{ marginBottom:20 }}>
            <Button
              type="primary"
              key="newAdd"
              onClick={() => {
                history.push(`/science-technology-manage/column-manage/edit`);
              }}
            >
              新增专栏
            </Button>
        </div>
        <div className={sc('container-body')}>
          <Table
            bordered
            columns={columns}
            dataSource={dataSource}
            rowKey={'id'}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                  onChange:getColumnList,
                  total: pageInfo.totalCount,
                  current: pageInfo.pageIndex,
                  pageSize: pageInfo.pageSize,
                  showTotal: (total) =>
                    `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.totalCount / pageInfo.pageSize) || 1}页`,
                }
            }
          />
        </div>
      </div>
      {useClickDrawer()}
      </>
    </PageContainer>
  )
}
