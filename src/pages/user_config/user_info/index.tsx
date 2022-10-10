import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,

  message,
  Space,

} from 'antd';
import { history } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import type Common from '@/types/common';
import moment from 'moment';
import { routeName } from '@/../config/routes';
import SelfTable from '@/components/self_table';

import { exportUsers, getUserPage } from '@/services/user';
import User from '@/types/user.d';
const sc = scopedClasses('service-config-requirement-manage');

const registerSource = {
  WEB: 'web端注册', WECHAT: '微信小程序注册', APP: 'APP'
}

export default () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [searchContent, setSearChContent] = useState<User.SearchBody>({});

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

  useEffect(() => {
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
      render: (_: string) => _ ? _ : '--',
    },
    {
      title: '注册端',
      dataIndex: 'registerSource',
      render: (text: any, record: any) => text?.desc,
      width: 100,
    },
    {
      title: '身份',
      dataIndex: 'userIdentities',
      render: (text: any, record: any) => text?.map(p => p.desc).join('、'),
      width: 100,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      width: 100,
    },
    {
      title: '操作',
      width: 100,
      fixed: 'right',
      dataIndex: 'option',
      render: (_: any, record: any) => {
        return (
          <Space>
            <Button
              key="1"
              size="small"
              type="link"
              onClick={() => {
                history.push(`${routeName.USER_INFO_DETAIL}?id=${record.id}`);
              }}
            >
              详情
            </Button>
          </Space>
        )
      }
    },
  ];

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
            {/* <Col span={6}>
              <Form.Item name="type" label="渠道值">
                <Select placeholder="请选择" allowClear>
                  {typeOptions?.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="type" label="场景值">
                <Select placeholder="请选择" allowClear>
                  {typeOptions?.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={6}>
              <Form.Item name="userIdentity" label="身份">
                <Select placeholder="请选择" allowClear>
                  {Object.entries(User.PlatRoleJson).map((p) => (
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
            <Col offset={8} span={4}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  if (search.time) {
                    search.createTimeStart = moment(search.time[0]).format('YYYY-MM-DD HH:mm:ss');
                    search.createTimeEnd = moment(search.time[1]).format('YYYY-MM-DD HH:mm:ss');
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


  const exportExcel = async () => {

    const res = await exportUsers({})
    console.log(res.data)


    //创建 blob对象 第一个参数 response.data是代表后端返回的文件流  ，第二个参数设置文件类型
    let blob = new Blob([res], {
      type: 'application/vnd.ms-excel;charset=UTF-8'
    });
    //生成生成下载链接  这个链接放在a标签上是直接下载，放在img上可以直接显示图片问价，视频同理


    let objectUrl = URL.createObjectURL(blob)
    let link = document.createElement("a");
    link.href = objectUrl;
    link.download = '用户信息列表'
    document.body.appendChild(link);
    link.click();
    //释放内存
    window.URL.revokeObjectURL(link.href);

    // const url = URL.createObjectURL(blob);
    //   let linkElement = document.createElement("a");
    //   linkElement.setAttribute("href", url);
    //   linkElement.setAttribute("download", '用户信息列表');
    // //模拟点击a标签
    //   if (typeof MouseEvent == "function") {
    //     var event = new MouseEvent("click", {
    //       view: window,
    //       bubbles: true,
    //       cancelable: false
    //     });
    //     linkElement.dispatchEvent(event);
    //   }  
    //   window.URL.revokeObjectURL(linkElement.href); 
  }


  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="title">
          <span>用户信息列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
        <Button
          type="primary"
          onClick={() => {
            exportExcel()
          }}
        >
          导出数据
        </Button>
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
