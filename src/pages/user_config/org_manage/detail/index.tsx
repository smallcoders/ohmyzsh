import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import {Button, Col, Row, Space, Table, Steps, Modal, Popconfirm, Input, message,Select} from "antd";
import  {useEffect, useState} from "react";
import {history} from "@@/core/history";
import {
  getOrgManageInfo,
  getOrgMemberPage,
  getOrgOperationLog,
  postChangeAdminList, putChangeAdmin,
  putOrgAudit
} from "@/services/org-type-manage";
export default () => {
  const [modelShow, setModelShow] = useState<boolean>(false);
  const [changeModelShow, setChangeModelShow] = useState<boolean>(false);
  const [refuseContent, setRefuseContent] = useState<string>('');
  const [orgInfo, setOrgInfo] = useState<any>('');
  const [value, setValue] = useState<string>();
  const [inputValue, setInputValue] = useState<string>();
  const [orgMemberInfo, setOrgMemberInfo] = useState<any>('');
  const [orgLogList, setOrgLogList] = useState<any>('');
  const [options, setOptions] = useState<any>('');
  const [orgMemberList, setOrgMemberList] = useState<any>('');
  const { Step } = Steps;
  // const info=[{name:'rweq',content:'423142',createTime:'123423'},{name:'rweq',content:'423142',createTime:'123423'},{name:'rweq',content:'423142',createTime:'123423'}]
  const [pageInfo, setPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectPageInfo, setSelectPageInfo] = useState({
    pageIndex: 1,
    pageSize: 10,
    pageTotal: 0,
    totalCount: 0,
  });
  const orgId = history.location.query?.id as string;

  //方法
  const handleChange = (newValue: string) => {
    setValue(newValue);
    console.log(newValue)
  };
  const handleSearch = (e: string) => {
    if(e.length==0){
      setSelectPageInfo({
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
        totalCount: 0,
      })
    }
    setInputValue(e)
    if(e.length>0){
      try{
        const data ={
          pageIndex:selectPageInfo.pageIndex, pageSize:selectPageInfo.pageSize,orgId,nameOrPhone:e
        }
        postChangeAdminList(data).then(res=>{
          if (res.code==0){
            setOptions(res.result)
            setSelectPageInfo({
              pageIndex:res?.pageIndex,
              pageSize: res?.pageSize,
              pageTotal: res?.pageTotal,
              totalCount:  res?.totalCount,
            })
          }
        })
      }catch (err){}
    }
  };
  //查询组织成员信息（组织名称、管理员名称）
  const handleAudit=(e: any)=>{
    setModelShow(true)
    setOrgMemberInfo(e)
  }

  //查询组织成员信息（组织名称、管理员名称）
  const getOrgInfo = async () => {
    try {
        const {code,result} =await getOrgManageInfo(orgId)
      if(code===0){
        setOrgInfo(result)
      }else{
        message.error('请求组织成员信息失败')
      }
    } catch (error) {
      console.log(error);
    }
  };
  //查询组织成员列表
  const getOrgPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const {code,result,res} =await getOrgMemberPage({orgId,pageIndex,pageSize})
      if(code===0){
        setPageInfo({total:res?.total,pageIndex:1,pageSize:10})
        setOrgMemberList(result)
      }else{
        message.error('请求组织成员列表数据失败')
      }
    } catch (error) {
      console.log(error);
    }
  };
  //查询组织操作日志
  const getOrgLog = async () => {
    try {
      const {code,result} =await getOrgOperationLog(orgId)
      if(code===0){
        setOrgLogList(result)
      }else{
        message.error('请求组织操作日志数据失败')
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getOrgInfo();
    getOrgPage();
    getOrgLog()
  }, []);

  const putAudit = async (e: any) => {
    try {
      const {todoId,userId} = orgMemberInfo
      const data={
        todoId,userId,orgId,isAgree:e,reason:e?'':refuseContent
      }
      const res =await putOrgAudit(data)
      if(res?.code===0){
        setModelShow(false)
        await getOrgInfo();
        await getOrgPage();
        await getOrgLog()
        if(!e){
          message.success('已成功拒绝')
        }else{
          message.success('用户成功加入组织')
        }
        // setOrgInfo(res?.result)
      }else{
        message.error(res.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const columns= [
    {
      title: '序号',
      dataIndex: 'sort',
      key: 'sort',
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '职务',
      dataIndex: 'dutyName',
      key: 'dutyName',
    },
    {
      title: '状态',
      dataIndex: 'audited',
      key: 'audited',
      render: (audited: boolean) =>{
        return (
          audited ? (
            <span>审核通过</span>
          ):(<span>未审核</span>)
        )
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, _record: any) => {
        return !_record.audited ? (
              <Space size="middle">
            <a
              href="#"
              onClick={() => {
                handleAudit(_record as any)
              }}
            >审核</a>
          </Space> ): (<span style={{  color:'#6680FF'}}>/</span>)

      }
    }
  ].filter(p => p);

  return (
    <PageContainer
    >
      <div className='org-manage-info' >
        <Row>
          <Col span={24}>
            <span style={{  fontWeight: 'bold' }}>企业名称：</span>
            <span style={{  fontWeight: 'bold' }}>{orgInfo?.orgName}</span>
          </Col>
          <Col span={6}>
            <span style={{ fontWeight: 'bold' }}>管理员：</span>
            <span style={{  fontWeight: 'bold'}}>{orgInfo?.adminName}</span>
          </Col>
          <Col span={6}>
            <Button
              type="link"
              onClick={()=>{
                setChangeModelShow(true)
              }}
            >
              更换管理员
            </Button>
          </Col>
        </Row>
      </div>
      <Modal
        visible={modelShow}
        title={
        <div>
            <span style={{color: '#faad14',marginRight:'10px'}} role=" img" aria-label=" exclamation-circle" className=" anticon
            anticon-exclamation-circle">
              <svg viewBox="64 64 896 896" focusable="false" data-icon="exclamation-circle"
                    width="1em" height="1em" fill="currentColor" aria-hidden="true">
                <path
                  d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
                <path
                  d="M464 688a48 48 0 1096 0 48 48 0 10-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z" />
              </svg>
            </span>
            <span>审核</span>
        </div>
      }
        maskClosable={false}
        onCancel={()=>{
                    setModelShow(false)
                  }}
        footer={[
          <Button key="back" onClick={()=>{
            setModelShow(false)
          }}>
            取消
          </Button>,
          <Popconfirm
            title={
              <>
                确定拒绝该用户？
                <Input.TextArea
                  onChange={(e) => setRefuseContent(e.target.value)}
                  placeholder={'拒绝原因（非必填）'}
                  value={refuseContent}
                  showCount
                  maxLength={50}
                />
              </>
            }
            onConfirm={()=>{putAudit(false)}}
          >
          <Button key="back">
            拒绝
          </Button>
          </Popconfirm>,
          <Button key="submit" type="primary"   onClick={()=>{
            putAudit(true)
          }}>
            通过
          </Button>,
        ]}
      >

        <p>姓名：{orgMemberInfo.name}</p>
        <p>申请备注：{orgMemberInfo.remark}</p>
      </Modal>
      <div className="org-manage-list">
        <div className="org-manage-title">组织成员列表</div>
        <Table
          bordered
          columns={columns}
          dataSource={orgMemberList}
          rowKey={'id'}
          pagination={
            pageInfo.total === 0
              ? false
              : {
                onChange: getOrgPage,
                total: pageInfo.total,
                current: pageInfo.pageIndex,
                pageSize: pageInfo.pageSize,
                showTotal: (total) =>
                  `共${total}条记录 第${pageInfo.pageIndex}/${Math.ceil(pageInfo.total / pageInfo.pageSize) || 1}页`,
              }
          }
        />
      </div>
      {orgLogList.length>0&&
      <div className="org-manage-log">
        <div className="org-manage-title">操作日志</div>
        <Steps progressDot current={1} direction="vertical">
          { orgLogList?.map((item: any)=>(
            <Step title={item?.name} subTitle={item?.createTime} description={item?.content} />
          ))}
        </Steps>
      </div>}
        <Modal
          visible={changeModelShow}
          onCancel={()=>{
            setChangeModelShow(false)
            setOptions([])
            setSelectPageInfo({
              pageIndex: 1,
              pageSize: 10,
              pageTotal: 0,
              totalCount: 0,
            })
            setValue('')
          }}
          onOk={async () => {
            try{
              const res = await putChangeAdmin({userId:value,orgId})
              if (res.code==0){
                setChangeModelShow(false)
                setOptions([])
                setSelectPageInfo({
                  pageIndex: 1,
                  pageSize: 10,
                  pageTotal: 0,
                  totalCount: 0,
                })
                setValue('')
                await getOrgInfo();
                await getOrgPage();
                await getOrgLog()
              } else if (res?.code === 11209) {
                setChangeModelShow(false)
                Modal.info({
                  icon: null,
                  title: '退出失败',
                  content: res?.message || '请求出错',
                  closable: true,
                  okText: '知道了',
                })
              }else{
                message.error(res.message || '请求出错')

              }
            }catch (e) {
            }

          }}
          title={'更换管理员'}>
          <div className='search' style={{marginBottom:'20px'}}>选择人员：
            <Select
              showSearch
              value={value}
              placeholder={'请输入姓名或手机号'}
              style={{width:'300px'}}
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              options={(options || []).map((d: any) => ({
                value: d.userId,
                label: `${d.name}__${d.phone}`,
              }))}
              onPopupScroll={()=>{
                if(selectPageInfo.pageTotal>selectPageInfo.pageIndex ){
                  const data ={
                    pageIndex:selectPageInfo.pageIndex+1, pageSize:selectPageInfo.pageSize,orgId,nameOrPhone:inputValue
                  }
                  postChangeAdminList(data).then(res=>{
                    if (res.code==0){
                      const arr=[...options,...res.result]
                      setOptions(arr)
                      setSelectPageInfo({
                        pageIndex:res?.pageIndex,
                        pageSize: res?.pageSize,
                        pageTotal: res?.pageTotal,
                        totalCount:  res?.totalCount,
                      })
                    }
                  })
                }
              }}
            />
          </div>
          <p>说明:可选择组织内员工或平台内无组织人员</p>
        </Modal>
    </PageContainer>
  );
};
