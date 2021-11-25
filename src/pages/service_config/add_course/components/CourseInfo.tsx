/* eslint-disable */
import { Input, Form, Select, InputNumber, Row, Col, message, TreeSelect, Button } from 'antd';
import '../service-config-add-course.less';
import scopedClasses from '@/utils/scopedClasses';
import { useEffect, useState } from 'react';
import { addCourse, updateCourse, getCourseById, getCourseType } from '@/services/course-manage';
import UploadForm from '@/components/upload_form';
import { history, Prompt, useModel } from 'umi';
import CourseManage from '@/types/service-config-course-manage';

const sc = scopedClasses('service-config-add-resource');
export default () => {
  /**
   * 课程类型
   */
  const [types, setTypes] = useState<{ id: string; name: string }[]>([]);
  /**
   * 正在编辑的一行记录
   */
  const [editingItem, setEditingItem] = useState<CourseManage.Content>({});

  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  /**
   * 关闭提醒 主要是 添加或者修改成功后 不需要弹出
   */
  const [isClosejumpTooltip, setIsClosejumpTooltip] = useState<boolean>(true);
  /**
   * 是否在编辑
   */
  const isEditing = Boolean(editingItem.id);

  const { setEditingCourse, setCurrent } = useModel(
    'useCourseManageModel',
    (model: {
      setEditingCourse: React.Dispatch<React.SetStateAction<CourseManage.Content | undefined>>;
      setCurrent: React.Dispatch<React.SetStateAction<number>>;
    }) => ({ setEditingCourse: model.setEditingCourse, setCurrent: model.setCurrent }),
  );

  const [form] = Form.useForm();
  /**
   * 准备数据和路由获取参数等
   */
  const prepare = async () => {
    try {
      const { result } = (await getCourseType()) as any;
      setTypes(result);
      const { courseId } = history.location.query as { courseId: string | undefined };

      if (courseId) {
        // 获取详情 塞入表单
        const detailRs = await getCourseById(courseId);
        const editItem = { ...detailRs.result };
        if (detailRs.code === 0) {
          setEditingItem({ id: detailRs.result.id, state: editItem.state });
          form.setFieldsValue({
            ...editItem,
            dictIds: editItem.dictIds ? editItem.dictIds.map((p: string) => parseInt(p)) : [],
          });
        } else {
          message.error(`获取详情失败，原因:{${detailRs.message}}`);
        }
      }
    } catch (error) {
      console.log('error', error);
      message.error('获取初始数据失败');
    }
  };

  useEffect(() => {
    prepare();
    window.addEventListener('beforeunload', listener);
    return () => {
      window.removeEventListener('beforeunload', listener);
    };
  }, []);

  /**
   * 添加或者修改
   */
  const addOrUpdate = () => {
    form
      .validateFields()
      .then(async (value: CourseManage.Content) => {
        const tooltipMessage = isEditing ? '修改' : '添加';
        const hide = message.loading(`正在${tooltipMessage}`);
        setAddOrUpdateLoading(true);
        const addorUpdateRes = await (isEditing
          ? updateCourse({
              ...value,
              ...editingItem,
            })
          : addCourse({
              ...value,
            }));
        hide();
        if (addorUpdateRes.code === 0) {
          if (!addorUpdateRes.result) {
            message.error('服务器错误');
            return;
          }
          message.success(`${tooltipMessage}成功`);
          setCurrent(1);
          setIsClosejumpTooltip(false);

          setEditingCourse({ id: addorUpdateRes.result });
        } else {
          message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
        }
        setAddOrUpdateLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const listener = (e: any) => {
    e.preventDefault();
    e.returnValue = '离开当前页后，所编辑的数据将不可恢复';
  };

  // 额外的副作用 用来解决表单的设置
  // useEffect(() => {
  //   form.setFieldsValue({ ...editingItem });
  // }, [editingItem]);

  const formLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 14 },
  };

  return (
    <>
      <Prompt
        when={isClosejumpTooltip && types.length > 0}
        message={'离开当前页后，所编辑的数据将不可恢复'}
      />
      <Form className={sc('container-form')} {...formLayout} form={form}>
        <Row>
          <Col span={12}>
            <Form.Item
              name="title"
              label="课程标题"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={35} />
            </Form.Item>
            <Form.Item
              name="dictIds"
              label="课程类别"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <TreeSelect
                multiple
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={types}
                placeholder="请选择"
                treeCheckable
                maxTagCount={3}
                fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              />
            </Form.Item>
            <Form.Item
              name="teacher"
              label="主讲教师"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input placeholder="请输入" maxLength={35} />
            </Form.Item>
            <Form.Item
              name="coverId"
              label="课程封面"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                maxSize={2}
                accept=".bmp,.gif,.png,.jpeg,.jpg"
                tooltip={
                  <span className={'tooltip'}>支持ipg、jpeg、png等格式的图片，大小不超过2M</span>
                }
              />
            </Form.Item>
            <Form.Item
              name="description"
              label="课程介绍"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input.TextArea
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item
              name="mustKnow"
              label="课程须知"
              rules={[
                {
                  required: true,
                  message: '必填',
                },
              ]}
            >
              <Input.TextArea
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
                showCount
                maxLength={200}
              />
            </Form.Item>
            <Form.Item name="grade" label="课程积分" initialValue={0}>
              <InputNumber
                placeholder="请输入"
                step={1}
                min={0}
                max={99999999}
                precision={0}
                addonAfter="分"
              />
            </Form.Item>
            <Form.Item name="sort" label="课程顺序">
              <InputNumber placeholder="请输入" step={1} min={1} max={99999999} precision={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ textAlign: 'center' }}>
        <Button type="primary" loading={addOrUpdateLoading} onClick={() => addOrUpdate()}>
          保存并进入下一步
        </Button>
      </div>
    </>
  );
};
