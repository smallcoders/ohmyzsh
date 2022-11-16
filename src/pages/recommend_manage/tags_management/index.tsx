import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message as antdMessage,
  Modal,
  message,
  Popconfirm,
} from 'antd';
const { Option } = Select;
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import SelfTable from '@/components/self_table';
import {
  getConsultPage, updateRemark, httpGetPublishTags, httpPostSaveTags, httpGetAllTags
} from '@/services/account';
import type AppResource from '@/types/app-resource';
import { EditTwoTone } from '@ant-design/icons';

import icon1 from '@/assets/demand_market/1.png'
import icon2 from '@/assets/demand_market/2.png'
import icon3 from '@/assets/demand_market/3.png'
import icon4 from '@/assets/demand_market/4.png'
import icon5 from '@/assets/demand_market/5.png'
import icon6 from '@/assets/demand_market/6.png'
import icon7 from '@/assets/demand_market/7.png'
import icon8 from '@/assets/demand_market/8.png'
import icon9 from '@/assets/demand_market/9.png'
import icon10 from '@/assets/demand_market/10.png'
import icon11 from '@/assets/demand_market/11.png'
import selectedIcon from '@/assets/demand_market/selected.png'

const sc = scopedClasses('user-config-tags-manage');

export default () => {
  const [dataSource, setDataSource] = useState<AppResource.ConsultRecordContent[]>([]);
  const [searchContent, setSearChContent] = useState<AppResource.ConsultRecordSearchBody>({});
  const [remark, setRemark] = useState<string>('');

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const [tags, setTags] = useState([
    {desc: '新一代信息技术', recCode: 10001}
  ])

  const [tagsObj, setTagsObj] = useState(
    {
      industryItems: [
        {
          recCode: 1,
          desc: ''
        }
      ],
      directionItems: {
        '智能化制造': [
          {
            recCode: 12,
            desc: '设备联网'
          }
        ],
        '数字化供应链': [
          {
            recCode: 25,
            desc: 'SCM'
          },
        ],
        '数字营销': [
          {
            recCode: 27,
            desc: '直播营销'
          }
        ]
      },
      territoryItems: [
        {
          recCode: 30,
          desc: '电子信息'
        }
      ]
    }
  )

  const getTags = async () => {
    try {
      const res = await httpGetPublishTags()
      setTagsObj(res.data || {})
    } catch {
      message.error('获取数据失败')
    }
  }

  const getAllTags = async() => {
    try {
      const res = await httpGetAllTags()
      setTags(res.data || [])
    } catch {
      message.error('获取数据失败')
    }
  }

  const getPage = async (pageIndex = pageInfo.pageIndex, pageSize = pageInfo.pageSize) => {
    try {
      const res = await getConsultPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      console.log(res);
      const {size,total,pages,current, records} = res.data
      if (res.code === 0) {
        setPageInfo({ totalCount: total, pageTotal: pages, pageIndex: current, pageSize: size });
        setDataSource(records || []);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  // 更新备注
  const updRemark = async (record: any) => {
    const tooltipMessage = '修改';
    try {
      const markResult = await updateRemark({
        userId: record.uidMng,
        remarkText: remark
      });
      if (markResult.code === 0) {
        antdMessage.success(`${tooltipMessage}成功`);
        getPage();
      } else {
        throw new Error(markResult.message);
      }
    } catch (error) {
      antdMessage.error(`${tooltipMessage}失败，原因:{${error}}`);
    }
  };

  // 处理回显标签
  const tagsDeal = (tags: any) => {
    let arr = tags?.split(',') || []
    let arr2 = []
    if(arr) {
      arr.map((item: any) => {
        arr2.push(Number(item));
      })
      return arr2.sort()
    }else {
      return []
    }
    
  }

  const editTags = (record: any) => {
    console.log(record);
    setRecordData(record)
    setIndustry(tagsDeal(record.industryLabelCodes))
    setOldIndustry(tagsDeal(record.industryLabelCodes))
    setSectorItems(tagsDeal(record.sectorLabelCodes))
    setOldSectorItems(tagsDeal(record.sectorLabelCodes))
    setTechnology(tagsDeal(record.techFieldLabelCodes))
    setOldTechnology(tagsDeal(record.techFieldLabelCodes))
    setModalVisible(true)
  }

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: AppResource.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 100,
      isEllipsis: true,
    },
    {
      title: '注册时间',
      dataIndex: 'userRegisterTime',
      width: 180,
      isEllipsis: true,
    },
    {
      title: '手机号',
      dataIndex: 'userPhone',
      isEllipsis: true,
      width: 132,
    },
    {
      title: '标签',
      dataIndex: 'allLabelsName',
      isEllipsis: true,
      width: 320,
    },
    {
      title: '操作',
      width: 80,
      dataIndex: 'option',
      fixed: 'right',
      render: (_: any, record: any) => {
        return (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => {
                editTags(record);
              }}
            >
              编辑
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getTags(),
    getAllTags()
  }, [])

  useEffect(() => {
    getPage();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="userName" label="用户名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="userPhone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="isHandle" label="标签">
                <Select 
                  placeholder="请选择" 
                  optionFilterProp="children"
                  allowClear 
                  mode="multiple"
                  showSearch
                  filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {tags.map((p) => (
                    <Select.Option key={'type' + p.recCode} value={p.recCode}>
                      {p.desc}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={2} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.isHandle) {
                    console.log(search.isHandle);
                    search.tagRecCodes = search.isHandle.sort().join(',')
                  }
                  setSearChContent(search);
                }}
              >
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

  const [editModalVisible, setModalVisible] = useState<boolean>(false);
  const [curModal, setCurModal] = useState(1)
  const [industry, setIndustry] = useState([])
  const [sectorItems, setSectorItems] = useState([])
  const [technology, setTechnology] = useState([])
  const [oldIndustry, setOldIndustry] = useState([])
  const [oldSectorItems, setOldSectorItems] = useState([])
  const [oldTechnology, setOldTechnology] = useState([])
  const [recordData, setRecordData] = useState({})
  const [banIndustry, setBanIndustry] = useState(false)

  const compareArrs = (a: any, b: any) => {
    let sortA = a.sort()
    let sortB = b.sort()
    return JSON.stringify(sortA)===JSON.stringify(sortB)
  }
  // 跳过
  const stepTo = (step: number) => {
    console.log(step);
    if(step == 1) {
      console.log(technology, '3-technology');
      if(!compareArrs(technology, oldTechnology)) {
        Modal.confirm({
          title: '',
          icon: null,
          content: '页面内容发生变更,确定跳过?',
          okText: '去保存',
          cancelText: '继续跳过',
          onOk: () => {
            
          },
          onCancel: () => {
            setTechnology([])
            setBanIndustry(false)
            setCurModal(step)
            setModalVisible(false)
          },
        });
      }else {
        setBanIndustry(false)
        setCurModal(step)
        setModalVisible(false)
      }
    // 跳到第二步，需要判断当前页面有没有选项，有的话需要给出弹框提示
    }else if(step == 2) {
      console.log(industry, '1-industry');
      if(!compareArrs(industry, oldIndustry)) {
        Modal.confirm({
          title: '',
          icon: null,
          content: '页面内容发生变更,确定跳过?',
          okText: '去保存',
          cancelText: '继续跳过',
          onOk: () => {
            
          },
          onCancel: () => {
            setIndustry([])
            setBanIndustry(false)
            setCurModal(step)
          },
        });
      }else {
        setBanIndustry(false)
        setCurModal(step)
      } 
    // 跳到第三步
    }else {
      console.log(sectorItems, '2-sectorItems');
      if(!compareArrs(sectorItems, oldSectorItems)) {
        Modal.confirm({
          title: '',
          icon: null,
          content: '页面内容发生变更,确定跳过?',
          okText: '去保存',
          cancelText: '继续跳过',
          onOk: () => {
            
          },
          onCancel: () => {
            setTechnology([])
            setBanIndustry(false)
            setCurModal(step)
          },
        });
      }else {
        setBanIndustry(false)
        setCurModal(step)
      } 
    }
  };

  // 保存标签数据
  const saveTags = async (from?: number, to?: number) => {
    console.log(from, to);
    let params = {}
    if(from == 1) {
      let arr:any = []
      industry.map((item) => {
        arr.push({recCode: item})
      })
      params = {
        industryItems: {
          recLabelSkipReqs: industry && industry.length>0 ? [...arr] : [{}]
        }
      }
    }else if(from == 2) {
      let arr:any = []
      sectorItems.map((item) => {
        arr.push({recCode: item})
      })
      params = {
        sectorItems: {
          recLabelSkipReqs: sectorItems && sectorItems.length>0 ?[...arr] : [{}]
        }
      }
    }else if(from == 3) {
      let arr:any = []
      technology.map((item) => {
        arr.push({recCode: item})
      })
      params = {
        techFieldItems: {
          recLabelSkipReqs: technology && technology.length>0 ?[...arr] : [{}]
        }
      }
    }
    params.userIdMng = recordData.uidMng
    try {
      const res = await httpPostSaveTags(params)
      console.log(res)
      if(res.code === 0) {
        setBanIndustry(false)
        setCurModal(to)
        getPage()
        if(!from || from == 3) {
          setModalVisible(false)
        }
      }else (
        message.error('操作失败')
      )
    } catch {
      message.error('操作失败')
    }
  }

  // 下一步
  const nextTo = () => {
    console.log(curModal, industry, 'curModal-industry');
    if(curModal == 1) {
      if(compareArrs(industry, oldIndustry)) {
        setCurModal(2)
      }else {
        saveTags(1, 2)
      }
    }else if (curModal == 2) {
      if(compareArrs(sectorItems, oldSectorItems)) {
        setCurModal(3)
      }else {
        saveTags(2, 3)
      }
    }else {
      if(compareArrs(technology, oldTechnology)) {
        setCurModal(1)
        setModalVisible(false)
      }else {
        saveTags(3, 1)
      }
    }
  }

  // 关闭第三方需求详情弹窗
  const handleCloseDemandModal = () => {
    if(!compareArrs(industry, oldIndustry) || !compareArrs(sectorItems, oldSectorItems) || !compareArrs(technology, oldTechnology)) {
      Modal.confirm({
        title: '',
        icon: null,
        content: '页面内容发生变更，确定关闭？',
        okText: '去保存',
        cancelText: '继续关闭',
        onOk: () => {
          
        },
        onCancel: () => {
          setCurModal(1)
          setModalVisible(false)
        },
      });
    }else {
      setCurModal(1)
      setModalVisible(false)
    } 
  }

  // 选择产业标签
  const selectIndustryItem = (e) => {
    console.log(e, e.target.parentElement.dataset);
    if(e.target.parentElement.dataset && e.target.parentElement.dataset.id) {
      let arr = [...industry]
      console.log(arr, 'arr');
      let {id} = e.target.parentElement.dataset
      if(arr.length == 3 && arr.indexOf(Number(id)) < 0) {
        return false
      }
      const inIndex = arr.indexOf(Number(id))
      console.log(inIndex, 'inIndex');
      if(inIndex > -1) {
        arr.splice(inIndex, 1)
      }else {
        arr.push(Number(id))
      }
      if(arr.length == 3) {
        setBanIndustry(true)
      }else {
        setBanIndustry(false)
      }
      setIndustry(arr)
    }
  }

  // 选择行业标签
  const selectprofessionItem = (e) => {
    console.log(e, e.target.dataset);
    if(e.target.dataset && e.target.dataset.id) {
      let arr = [...sectorItems]
      console.log(arr, 'arr');
      let {id} = e.target.dataset
      if(arr.length == 3 && arr.indexOf(Number(id)) < 0) {
        return false
      }
      const inIndex = arr.indexOf(Number(id))
      console.log(inIndex, 'inIndex');
      if(inIndex > -1) {
        arr.splice(inIndex, 1)
      }else {
        arr.push(Number(id))
      }
      if(arr.length == 3) {
        setBanIndustry(true)
      }else {
        setBanIndustry(false)
      }
      setSectorItems(arr)
    }
  }

  // 选择技术领域标签 technology
  const selectTechnologyItem = (e) => {
    console.log(e, e.target.dataset);
    if(e.target.dataset && e.target.dataset.id) {
      let arr = [...technology]
      console.log(arr, 'arr');
      let {id} = e.target.dataset
      if(arr.length == 3 && arr.indexOf(Number(id)) < 0) {
        return false
      }
      const inIndex = arr.indexOf(Number(id))
      console.log(inIndex, 'inIndex');
      if(inIndex > -1) {
        arr.splice(inIndex, 1)
      }else {
        arr.push(Number(id))
      }
      if(arr.length == 3) {
        setBanIndustry(true)
      }else {
        setBanIndustry(false)
      }
      setTechnology(arr)
    }
  }

  const editModal = () => {
    return (
      <Modal
        title="请选择"
        width={1200}
        className={sc('demand-detail-modal')}
        visible={editModalVisible}
        footer={
          <>
            <Button key="submit" type="primary" className='next-step' onClick={() => {nextTo()}}>
              {curModal == 3 ? '完成' : '下一步'}
            </Button>
          </>
        }
        onCancel={handleCloseDemandModal}
        closable={true}
        maskClosable={false}
        destroyOnClose={true}
        forceRender={true}
      >
        <div className={curModal != 1 ? 'hideModal' : ''}>
          <div className={sc('container-modal-header')}>
            <h3>您关注的产业</h3>
            <Button type='text' onClick={() => {stepTo(2)}}>跳过</Button>
          </div>
          <ul className={sc('container-modal-select')} onClick={() => {selectIndustryItem(event)}}>
            <Row gutter={[16, 24]}>
              {tagsObj.industryItems.map((el) => {
                return (
                  <Col span={6} key={el.recCode}>
                    <li 
                      className={ sc('container-modal-select-item1')} 
                      style={{
                        border: industry.indexOf(el.recCode) > -1 ? '1px solid #0068FF' : '1px dashed #ddd',
                        cursor: industry.indexOf(el.recCode) < 0 && banIndustry ? 'not-allowed' : 'pointer'
                      }}
                      data-id={el.recCode} data-ban={industry.indexOf(el.recCode) < 0 && banIndustry }
                    >
                      <img 
                        src={
                          el.desc == '新能源汽车和智能网联汽车' ? icon2 : 
                          el.desc == '数字创意' ? icon3 : 
                          el.desc == '高端制造设备' ? icon4 : 
                          el.desc == '新能源和节能环保' ? icon5 : 
                          el.desc == '绿色食品' ? icon6 : 
                          el.desc == '生命健康' ? icon7 : 
                          el.desc == '智能家电' ? icon8 : 
                          el.desc == '新材料' ? icon9 : 
                          el.desc == '人工智能' ? icon10 : 
                          el.desc == '其他' ? icon11 : icon1
                        }  
                        className='background-img'/>
                      <p>{el.desc}</p>
                      <div className='mask'
                        style={{
                          background: industry.indexOf(el.recCode) > -1 ? 'rgba(0,0,0,.2)' : 'rgba(30, 35, 42, 0.6)',
                        }}
                      ></div>
                      {
                        industry.indexOf(el.recCode) > -1 && (
                          <img src={selectedIcon} className="selected-icon"/>
                        )
                      }
                    </li>
                    </Col>
                );
              })}
            </Row>
          </ul>
        </div>
        <div className={curModal != 2 ? 'hideModal' : ''}>
          <div className={sc('container-modal-header')}>
            <h3>您关注的行业方向</h3>
            <Button type='text' onClick={() => {stepTo(3)}}>跳过</Button>
          </div>
          {Object.keys(tagsObj.directionItems).map((item) => {
            return (
              <>
                <h3>{item}</h3>
                <ul className={sc('container-modal-select')} onClick={() => {selectprofessionItem(event)}}>
                  {
                    tagsObj.directionItems[item].map((el) => {
                      return (
                        <li
                          className={ sc('container-modal-select-item')} 
                          style={{
                            border: sectorItems.indexOf(el.recCode) > -1 ? '1px solid #0068FF' : '1px solid #DEDFE4', 
                            color: sectorItems.indexOf(el.recCode) > -1 ? '#0068FF' : '#4B586C',
                            cursor: sectorItems.indexOf(el.recCode) < 0 && banIndustry ? 'not-allowed' : 'pointer'
                          }}
                          data-id={el.recCode} data-ban={industry.indexOf(el.recCode) < 0 && banIndustry }
                        >
                          {el.desc}
                          {
                            sectorItems.indexOf(el.recCode) > -1 && (
                              <img src={selectedIcon} className="selected-icon"/>
                            )
                          }
                        </li>
                      )
                    })
                  }
                </ul>
              </>  
            )
          })}
        </div>
        <div className={curModal != 3 ? 'hideModal' : ''}>
          <div className={sc('container-modal-header')}>
            <h3>您关注的技术领域</h3>
            <Button type='text' onClick={() => {stepTo(1)}}>跳过</Button>
          </div>
          <ul className={sc('container-modal-select')} onClick={() => {selectTechnologyItem(event)}}>
            {tagsObj.territoryItems.map((el) => {
              return (
                <li 
                  className={sc('container-modal-select-item')} 
                  style={{
                    border: technology.indexOf(el.recCode) > -1 ? '1px solid #0068FF' : '1px solid #DEDFE4', 
                    color: technology.indexOf(el.recCode) > -1 ? '#0068FF' : '#4B586C',
                    cursor: technology.indexOf(el.recCode) < 0 && banIndustry ? 'not-allowed' : 'pointer'
                  }}
                  data-id={el.recCode} data-ban={technology.indexOf(el.recCode) < 0 && banIndustry }
                >
                  {el.desc}
                  {
                    technology.indexOf(el.recCode) > -1 && (
                      <img src={selectedIcon} className="selected-icon"/>
                    )
                  }
                </li>
              );
            })}
            
          </ul>
        </div>
      </Modal>
    ) 
  }

  return (
    <>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>管理列表(共{pageInfo.totalCount || 0}条)</span>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 1480 }}
          columns={columns}
          expandable={{
            expandedRowRender: (record: any) => (
              <p style={{ margin: 0 }}>
                备注：{record.mngRemark}
                {/* {record.isEdit && ( */}
                  <Popconfirm
                    icon={null}
                    title={
                      <>
                        <Input.TextArea
                          placeholder="可在此填写备注内容，备注非必填"
                          onChange={(e) => setRemark(e.target.value)}
                          value={remark}
                          showCount
                          maxLength={100}
                        />
                      </>
                    }
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => updRemark(record)}
                  >
                    <EditTwoTone
                      onClick={() => {
                        setRemark(record.mngRemark || '');
                      }}
                    />
                  </Popconfirm>
                {/* )} */}
              </p>
            ),
            expandIcon: () => <></>,
            defaultExpandAllRows: true,
            expandedRowKeys: dataSource.map((p) => p.id),
          }}
          rowKey={'id'}
          dataSource={dataSource}
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
      {editModal()}
    </>
  );
};
