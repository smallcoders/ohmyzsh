import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  message,
  Space,
  Popconfirm,
  Pagination,
  TreeSelect,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import './service-config-course-manage.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import Common from '@/types/common';
import {
  getCoursePage,
  getSearchCourseType,
  removeCourse,
  setCourseTop,
  updateCourseState,
} from '@/services/course-manage';
import CourseManage from '@/types/service-config-course-manage';
import { history } from 'umi';
import { routeName } from '../../../../config/routes';

const sc = scopedClasses('service-config-course-manage');
export default () => {
  const [dataSource, setDataSource] = useState<CourseManage.Content[]>([]);
  const [types, setTypes] = useState([]);
  const [searchContent, setSearChContent] = useState<{
    title?: string; // 标题
    publishTime?: string; // 发布时间
    state?: number; // 状态：0发布中、1待发布、2已下架
  }>({});

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

  /**
   * 准备数据等
   */
  const prepare = async () => {
    try {
      const { result } = (await getSearchCourseType()) as any;
      setTypes(result);
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };
  useEffect(() => {
    prepare();
  }, []);

  const getCourses = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code } = await getCoursePage({
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

  const remove = async (id: string) => {
    try {
      const removeRes = await removeCourse(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getCourses();
      } else {
        message.error(`删除失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const down = async (id: string) => {
    try {
      const removeRes = await updateCourseState(id, false);
      if (removeRes.code === 0) {
        message.success(`下架成功`);
        getCourses();
      } else {
        message.error(`下架失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const up = async (id: string) => {
    try {
      const removeRes = await updateCourseState(id, true);
      if (removeRes.code === 0) {
        message.success(`上架成功`);
        getCourses();
      } else {
        message.error(`上架失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const top = async (id: string) => {
    try {
      const removeRes = await setCourseTop(id);
      if (removeRes.code === 0) {
        message.success(`置顶成功`);
        getCourses();
      } else {
        message.error(`置顶失败，原因:{${removeRes.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCourses();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={7}>
              <Form.Item name="title" label="课程名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="dictId" label="课程类型">
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={types}
                  placeholder="请选择"
                  fieldNames={{ label: 'name', value: 'id', children: 'children' }}
                />
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item name="state" label="当前状态">
                <Select placeholder="请选择" allowClear>
                  <Select.Option value={'true'}>发布中</Select.Option>
                  <Select.Option value={'false'}>待发布</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={3}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="primary"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="primary"
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

  return (
    <PageContainer className={sc('container')}>
      {useSearchNode()}
      <div className={sc('container-table-header')}>
        <div className="title">
          <span>课程列表(共{pageInfo.totalCount || 0}个)</span>
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              history.push(`${routeName.ADD_COURSE}`);
            }}
          >
            <PlusOutlined /> 新建课程
          </Button>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        {dataSource.map((p) => (
          <div className={sc('container-table-body-item')}>
            <span>{p.sort}</span>
            <div className={sc('container-table-body-item-content')}>
              <div>
                <img src={`/iiep-manage/common/download/${p.coverId}`} alt="图片损坏" />
                <div>
                  <div>
                    <span
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                      }}
                    >
                      {p.title}
                    </span>
                    <div className={'state'}>{p.state ? '发布中' : '待发布'}</div>
                  </div>
                  <div
                    style={{
                      color: '#999',
                      fontSize: 12,
                      width: '90%',
                    }}
                  >
                    {p.dictName}
                  </div>
                  <span>
                    课程长约：{p.duration} ｜ 共 {p.chapterCount} 个章节
                  </span>
                  <span
                    style={{
                      color: '#999',
                      fontSize: 12,
                    }}
                  >
                    创建于{p.createTime} {p.updateTime ? `｜ 上次更新：${p.updateTime}` : ''}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{ display: 'grid', textAlign: 'center', padding: '10px' }}>
                    <span>学习人数</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#6680ff' }}>
                      {p.studyCount}
                    </span>
                  </div>
                  <div style={{ display: 'grid', textAlign: 'center', padding: '10px' }}>
                    <span>收藏人数</span>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#6680ff' }}>
                      {p.collectionCount}
                    </span>
                  </div>
                </div>
                <Space style={{ marginTop: 0 }}>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      history.push(`${routeName.ADD_COURSE}?courseId=${p.id}`);
                    }}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定删除么？"
                    okText="确定"
                    cancelText="取消"
                    onConfirm={() => remove(p.id as string)}
                  >
                    <Button type="primary" ghost>
                      删除
                    </Button>
                  </Popconfirm>
                  {p.state && (
                    <Popconfirm
                      title="确定下架么？"
                      okText="确定"
                      cancelText="取消"
                      onConfirm={() => down(p.id as string)}
                    >
                      <Button type="primary" ghost>
                        下架
                      </Button>
                    </Popconfirm>
                  )}
                  {!p.state && (
                    <Button type="primary" ghost onClick={() => up(p.id as string)}>
                      上架
                    </Button>
                  )}
                  {p.state && (
                    <Button type="primary" ghost onClick={() => top(p.id as string)}>
                      置顶
                    </Button>
                  )}
                </Space>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Pagination
        style={{ float: 'right' }}
        showTotal={(total) =>
          `共${total}条记录 第${pageInfo.pageIndex}/${pageInfo.pageTotal || 1}页`
        }
        showQuickJumper
        onChange={getCourses}
        total={pageInfo.totalCount}
        current={pageInfo.pageIndex}
        pageSize={pageInfo.pageSize}
      />
    </PageContainer>
  );
};
