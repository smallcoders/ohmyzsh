import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  Popconfirm,
  message,
  Space,
} from 'antd';
import { Access, useAccess } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';
import { UploadOutlined } from '@ant-design/icons';
import { exportUserList } from '@/services/export';
import {
  getAllChannelAndScene,
  getQueryUserManageRisky,
  getListEnumsByKey,
  getUserPage,
} from '@/services/user';
import User from '@/types/user.d';
import { handleAudit } from '@/services/audit';
import type Activity from '@/types/operation-activity';
import { OrgState } from '@/types/user';
const sc = scopedClasses('service-config-requirement-manage');

// const registerSource = {
//   WEB: 'web端注册', WECHAT: '微信小程序注册', APP: 'APP', OTHER: '其他'
// }
enum Edge {
  HOME = 0,
}

export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectChannelListAll, setSelectChannelAll] = useState<Activity.Content[]>([]);
  const [selectSceneListAll, setSelectSceneAll] = useState<Activity.Content[]>([]);
  const [searchContent, setSearChContent] = useState<User.SearchBody>({});
  // 拿到当前角色的access权限兑现
  const access = useAccess();
  // 当前页面的对应权限key
  const [edge, setEdge] = useState<Edge.HOME>(Edge.HOME);
  // 页面权限
  const permissions = {
    [Edge.HOME]: 'PQ_UM_YHXX', // 用户管理-用户信息
  };

  useEffect(() => {
    for (const key in permissions) {
      const permission = permissions[key];
      if (Object.prototype.hasOwnProperty.call(access, permission)) {
        setEdge(key as any);
        break;
      }
    }
  }, []);
  const [registerSource, setRegisterSource] = useState<any>({});
  const [platRoleJson, setPlatRoleJson] = useState<any>({});

  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 20,
    totalCount: 0,
    pageTotal: 0,
  });

  useEffect(() => {}, []);

  //获取全部场景值
  const getSceneAndChannelList = async () => {
    try {
      const res = await getAllChannelAndScene();
      if (res.code === 0) {
        setSelectSceneAll(res?.result.scenes);
        setSelectChannelAll(res?.result.channels);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const prepare = async () => {
    try {
      const res = await Promise.all([
        getListEnumsByKey({
          key: 'USER_REGISTER_SOURCE',
        }),
        getListEnumsByKey({
          key: 'USER_IDENTITY',
        }),
      ]);
      if (res[0]?.code === 0) {
        const obj = {};
        res[0]?.result &&
          res[0]?.result?.forEach((item: any) => {
            obj[item.name] = item.desc;
          });
        setRegisterSource(obj);
      } else {
        throw new Error('');
      }
      if (res[1]?.code === 0) {
        const obj2 = {};
        res[1]?.result &&
          res[1]?.result?.forEach((item: any) => {
            obj2[item.name] = item.desc;
          });
        setPlatRoleJson(obj2);
      } else {
        throw new Error('');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSceneAndChannelList();
    prepare();
  }, []);

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getUserPage({
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
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      width: 100,
      render: (_: any, _record: any) => {
        return (
          <div>
            {_ || '--'}
            {_record?.risky && <div className={sc('container-table-body-table-name')}>风险</div>}
          </div>
        );
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: 200,
      render: (_: string) => (_ ? _ : '--'),
    },
    {
      title: '注册端',
      dataIndex: 'registerSource',
      render: (text: any, record: any) => text?.desc,
      width: 100,
    },
    {
      title: '注册渠道值',
      dataIndex: 'channelName',
      width: 100,
    },
    {
      title: '注册场景值',
      dataIndex: 'sceneName',
      width: 100,
    },
    {
      title: '身份',
      dataIndex: 'userIdentities',
      render: (text: any, record: any) => text?.map((p) => p.desc).join('、'),
      width: 100,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      width: 100,
      render: (orgName: any, record: any) => {
        return (
          <div className="org-name">
            {orgName || '--'}
            {record?.orgNum > 1 && orgName && <span className="org-number">+{record?.orgNum}</span>}
          </div>
        );
      },
    },
    {
      title: '加入组织状态',
      dataIndex: 'orgState',
      width: 100,
      render: (orgState: any, record: any) => {
        return (
          <div className="org-name">
            {orgState === 'AUTHED' && <span>已认证</span>}
            {orgState === 'AUDITING' && <span>审核中</span>}
            {orgState === 'NOT_AUTH' && <span>未认证</span>}
            {!orgState && <span>--</span>}
          </div>
        );
      },
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              key="1"
              size="small"
              type="link"
              onClick={() => {
                window.open(`${routeName.USER_INFO_DETAIL}?id=${record.id}`);
              }}
            >
              详情
            </Button>
            {record?.risky && (
              <Popconfirm
                placement="topRight"
                title={
                  <>
                    <div>复审</div>
                    <div>姓名：{record?.name || '--'}</div>
                    <div>系统不通过原因：{record?.systemRejectReason || '--'}</div>
                  </>
                }
                onConfirm={() => {
                  handleRecheckBtn(record, true);
                }}
                onCancel={() => {
                  handleRecheckBtn(record, false);
                }}
                okText="复审正常"
                cancelText="确定异常"
              >
                <Button size="small" type="link">
                  复审
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  // 姓名风险用户数
  const [userCount, setUserCount] = useState<number>(0);

  const _getQueryUserManageRisky = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, code } = await getQueryUserManageRisky({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setUserCount(result || 0);
      } else {
        message.error(`请求姓名风险用户数失败`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPage();
    _getQueryUserManageRisky();
  }, [searchContent]);
  const [searchForm] = Form.useForm();
  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={6}>
              <Form.Item name="name" label="姓名">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="phone" label="手机号">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="time" label="注册时间">
                <DatePicker.RangePicker allowClear showTime />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="registerSource" label="注册端">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(registerSource).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="channelName" label="注册渠道值">
                <Select placeholder="请选择" allowClear>
                  {selectChannelListAll.map((item, index) => (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="sceneName" label="注册场景值">
                <Select placeholder="请选择" allowClear>
                  {selectSceneListAll.map((item, index) => (
                    <Select.Option key={index} value={item}>
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="userIdentity" label="身份">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(platRoleJson).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orgName" label="所属组织">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="risky" label="报警标识">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(User.RiskyState).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="orgState" label="加入组织状态">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(User.orgState).map((p) => (
                    <Select.Option key={p[0] + p[1]} value={p[0]}>
                      {p[1]}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col offset={20} span={4}>
              <Button
                style={{ marginRight: 20, marginBottom: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
                  }
                  if (search?.risky) {
                    if (search?.risky === 'RISK') {
                      Object.assign(search, { risky: true });
                    } else {
                      Object.assign(search, { risky: false });
                    }
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

  const downloadLink = (url: string): void => {
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const serialize = function (obj: any): string {
    const str = [];
    for (const p in obj)
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    return str.join('&');
  };
  const getExportUrl = (): string => {
    const search = searchForm.getFieldsValue();
    if (search.time) {
      search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
      search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
    }
    console.log(serialize(search));
    return `/antelope-user/mng/user/exportUser?${serialize(search)}`;
  };

  // const exportExcel = async () => {

  //   const res = await exportUsers({})
  //   console.log(res.data)

  //   //创建 blob对象 第一个参数 response.data是代表后端返回的文件流  ，第二个参数设置文件类型
  //   let blob = new Blob([res], {
  //     type: 'application/vnd.ms-excel;charset=UTF-8'
  //   });
  //   //生成生成下载链接  这个链接放在a标签上是直接下载，放在img上可以直接显示图片问价，视频同理

  //   let objectUrl = URL.createObjectURL(blob)
  //   let link = document.createElement("a");
  //   link.href = objectUrl;
  //   link.download = '用户信息列表'
  //   document.body.appendChild(link);
  //   link.click();
  //   //释放内存
  //   window.URL.revokeObjectURL(link.href);

  //   // const url = URL.createObjectURL(blob);
  //   //   let linkElement = document.createElement("a");
  //   //   linkElement.setAttribute("href", url);
  //   //   linkElement.setAttribute("download", '用户信息列表');
  //   // //模拟点击a标签
  //   //   if (typeof MouseEvent == "function") {
  //   //     var event = new MouseEvent("click", {
  //   //       view: window,
  //   //       bubbles: true,
  //   //       cancelable: false
  //   //     });
  //   //     linkElement.dispatchEvent(event);
  //   //   }
  //   //   window.URL.revokeObjectURL(linkElement.href);
  // }
  const exportList = async () => {
    const {
      name,
      phone,
      registerSource,
      orgName,
      orgState,
      channelName,
      sceneName,
      userIdentity,
      createTimeStart,
      createTimeEnd,
    } = searchForm.getFieldsValue();
    console.log('@searchContent', searchContent);

    try {
      const res = await exportUserList({
        name,
        phone,
        registerSource,
        orgName,
        orgState,
        userIdentity,
        createTimeStart,
        createTimeEnd,
        channelName,
        sceneName,
      });
      if (res?.data.size == 67 || res?.data.type == 'application/json')
        return message.warning('操作太过频繁，请稍后再试');
      const content = res?.data;
      const blob = new Blob([content], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
      });
      const fileName = '用户信息.xlsx';
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecheckBtn = async (record: any, state: boolean) => {
    const text = state ? '复审正常' : '确定异常';
    try {
      const res = await handleAudit({
        auditId: record?.auditId || '', // 审核id
        result: state, // 通过/拒绝
      });
      if (res?.code === 0) {
        message.success(`${text}完成`);
        getPage();
        _getQueryUserManageRisky();
      } else {
        throw new Error('');
      }
    } catch (error) {
      message.error(`${text}失败，请稍后重试`);
    }
  };

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div
        className={sc('container-table-header')}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div className="title">
          <span>
            用户信息列表(共{pageInfo.totalCount || 0}个, 姓名风险用户
            <span style={{ color: 'red' }}>{userCount}</span>
            个)
          </span>
        </div>
        {/* <Button
          type="primary"
          onClick={() => {
            downloadLink(getExportUrl());
          }}
        >
          导出
        </Button> */}
        <Access accessible={access.PX_UM_YHXX}>
          <Button icon={<UploadOutlined />} onClick={exportList}>
            导出
          </Button>
        </Access>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          bordered
          scroll={{ x: 780 }}
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
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
    </PageContainer>
  );
};
