import { addChapters, getChaptersById } from '@/services/course-manage';
import CourseManage from '@/types/service-config-course-manage';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  AudioOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileUnknownOutlined,
  InboxOutlined,
  MinusSquareFilled,
  PictureOutlined,
  PlusOutlined,
  PlusSquareFilled,
  UploadOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
} from 'antd';
import { RcFile, UploadChangeParam } from 'antd/lib/upload';
import Dragger from 'antd/lib/upload/Dragger';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { history, useModel } from 'umi';
import { routeName } from '../../../../../config/routes';
import '../service-config-add-course.less';

const chaptersArr = [
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三',
  '十四',
  '十五',
  '十六',
  '十七',
  '十八',
  '十九',
  '二十',
];

type EditType = CourseManage.Chapter & { isOpen?: boolean };

export default () => {
  const { setEditingCourse, setCurrent, editingCourse } = useModel(
    'useCourseManageModel',
    (model: {
      setEditingCourse: React.Dispatch<React.SetStateAction<CourseManage.Content | undefined>>;
      setCurrent: React.Dispatch<React.SetStateAction<number>>;
      editingCourse: CourseManage.Content | undefined;
    }) => ({
      setEditingCourse: model.setEditingCourse,
      setCurrent: model.setCurrent,
      editingCourse: model.editingCourse,
    }),
  );

  /**
   * 正在编辑的章节
   */
  const [editingItem, setEditingItem] = useState<EditType | undefined>();
  const [dataSource, setDataSource] = useState<EditType[]>([]);
  // 因为需要将状态带回给后端 所以需要存储
  // const [courseState, setCourseState] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [files, setFiles] = useState<CourseManage.File[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const courseId = history.location.query?.courseId as string | undefined;

  const accept = '.bmp,.gif,.png,.jpeg,.jpg,.mp3,.mp4,.pdf,.pptx,.ppt';
  /**
   * 添加或者修改 loading
   */
  const [addOrUpdateLoading, setAddOrUpdateLoading] = useState<boolean>(false);

  /**
   * 准备数据和路由获取参数等
   */
  const prepare = async () => {
    try {
      if (courseId) {
        // 获取详情 塞入表单
        const detailRs = await getChaptersById(courseId);
        if (detailRs.code === 0) {
          setDataSource(detailRs.result?.chapters || []);
          if (detailRs.result?.chapters && detailRs.result?.chapters.length > 0) {
            setEditingItem(detailRs.result?.chapters[0]);
          }
          setEditingCourse((preState) => {
            return { ...preState, state: detailRs.result?.state };
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
    return () => {
      setCurrent(0);
    };
  }, []);

  const submitChapter = async (state = editingCourse?.state as boolean, tooltipMessage: string) => {
    if (dataSource.length === 0) {
      message.error('请先添加章节');
      return;
    }
    const hide = message.loading(`正在${tooltipMessage}`);
    setAddOrUpdateLoading(true);
    try {
      const addorUpdateRes = await addChapters({
        courseId: editingCourse?.id as string,
        chapters: dataSource,
        state,
      });
      hide();
      if (addorUpdateRes.code === 0) {
        message.success(`${tooltipMessage}成功`);
        history.replace(routeName.COURSE_MANAGE);
        setCurrent(0);
      } else {
        message.error(`${tooltipMessage}失败，原因:{${addorUpdateRes.message}}`);
      }
    } catch (error) {
      hide();
      console.log(error);
    }
    setAddOrUpdateLoading(false);
  };

  const add = () => {
    const newChapter = {
      courseId: editingCourse?.id,
      title: '标题',
      description: '',
      minTime: 5,
      sort: dataSource.length + 1,
      extras: [] as CourseManage.File[],
      isOpen: true,
    };
    setEditingItem(newChapter);
    setDataSource([...dataSource, newChapter]);
  };

  const up = (index: number) => {
    if (index === 0) return;
    const dataSource_copy = [...dataSource];
    const tmp = { ...dataSource_copy[index] };
    dataSource_copy[index] = { ...dataSource_copy[index - 1], sort: index + 1 };
    dataSource_copy[index - 1] = { ...tmp, sort: index };
    if (editingItem?.sort === index + 1) {
      setEditingItem((pre) => {
        return { ...pre, sort: (pre?.sort || 1) - 1 } as EditType;
      });
    }
    if (editingItem?.sort === index) {
      setEditingItem((pre) => {
        return { ...pre, sort: (pre?.sort || 1) + 1 } as EditType;
      });
    }
    setDataSource(dataSource_copy);
  };

  /**
   * 实时修改数据
   * @param field 字段名称
   * @param index 章节下标
   * @param value 值
   */
  const save = (field: string, index: number, value: any) => {
    if (index < 0) return;
    setEditingItem({ ...editingItem, [field]: value } as EditType);
    const dataSource_copy = [...dataSource];
    dataSource_copy.splice(index, 1, {
      ...dataSource_copy[index],
      [field]: value,
    } as EditType);
    setDataSource(dataSource_copy);
  };

  useEffect(() => {
    form.setFieldsValue({ ...(editingItem || {}) });
  }, [editingItem]);

  const down = (index: number) => {
    if (index === dataSource.length - 1) return;
    const dataSource_copy = [...dataSource];
    const tmp = { ...dataSource_copy[index] };
    dataSource_copy[index] = { ...dataSource_copy[index + 1], sort: index + 1 };
    dataSource_copy[index + 1] = { ...tmp, sort: index + 1 + 1 };

    if (editingItem?.sort === index + 1) {
      setEditingItem((pre) => {
        return { ...pre, sort: (pre?.sort || 1) + 1 } as EditType;
      });
    }
    if (editingItem?.sort === index + 1 + 1) {
      setEditingItem((pre) => {
        return { ...pre, sort: (pre?.sort || 1) - 1 } as EditType;
      });
    }
    setDataSource(dataSource_copy);
  };

  const remove = (index: number) => {
    if (editingItem?.sort === index + 1) {
      // 删除当前正在编辑的
      setEditingItem(undefined);
    }
    if ((editingItem?.sort as number) > index + 1) {
      // 当前删除的在编辑的前面
      setEditingItem((pre) => {
        return { ...pre, sort: (pre?.sort || 1) - 1 } as EditType;
      });
    }
    // 需要重新排序 id
    setDataSource((preState) => {
      preState.splice(index, 1);
      return preState.map((p, i) => {
        p.sort = i + 1;
        return p;
      });
    });
  };

  const editChapter = (changedFields: any[]) => {
    try {
      const changeFormItem = changedFields[0];
      save(changeFormItem.name[0], (editingItem?.sort || 0) - 1, changeFormItem.value);
    } catch (error) {
      console.log(error);
    }
  };

  const getFileIcon = (fileName: string) => {
    const lastName = fileName.split('.')[1];
    const images = ['.bmp', '.gif', '.png', '.jpeg', '.jpg'];
    const videos = ['.mp4'];
    const ppts = ['.pptx', '.ppt'];
    const pdfs = ['.pdf'];
    const audios = ['.mp3'];
    if (images.includes('.' + lastName)) {
      return <PictureOutlined />;
    } else if (videos.includes('.' + lastName)) {
      return <VideoCameraOutlined />;
    } else if (ppts.includes('.' + lastName)) {
      return <FilePptOutlined />;
    } else if (pdfs.includes('.' + lastName)) {
      return <FilePdfOutlined />;
    } else if (audios.includes('.' + lastName)) {
      return <AudioOutlined />;
    } else {
      return <FileUnknownOutlined />;
    }
  };

  const settings = () => {
    return (
      <div>
        <Card
          type="inner"
          title="章节设置"
          bodyStyle={{
            minHeight: 'calc(100vh - 410px)',
          }}
        >
          <Button onClick={add} type="primary" icon={<PlusOutlined />} style={{ width: '100%' }}>
            {' '}
            新建章节
          </Button>
          {dataSource.map((p, index) => (
            <div
              className="chapter-item"
              key={'title' + index}
              style={
                editingItem?.sort === p.sort
                  ? { backgroundColor: '#6680ff', color: '#fff' }
                  : undefined
              }
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                  {p.isOpen ? (
                    <MinusSquareFilled
                      onClick={() => {
                        if (!p.isOpen) return;
                        save('isOpen', index, false);
                      }}
                    />
                  ) : (
                    <PlusSquareFilled
                      onClick={() => {
                        if (p.isOpen) return;
                        save('isOpen', index, true);
                      }}
                    />
                  )}
                  <div
                    onClick={() => setEditingItem(p)}
                    style={{ marginLeft: 5, cursor: 'pointer', flex: 1 }}
                  >
                    {`第${chaptersArr[index]}章：` + p.title}
                  </div>
                </div>
                <div
                  className={'option'}
                  style={editingItem?.sort === p.sort ? { display: 'initial' } : {}}
                >
                  <Space size={5}>
                    <ArrowUpOutlined
                      className="icon-option"
                      onClick={() => {
                        up(index);
                      }}
                    />
                    <ArrowDownOutlined
                      className="icon-option"
                      onClick={() => {
                        down(index);
                      }}
                    />
                    <DeleteOutlined
                      onClick={() => {
                        if (!p.extras || p.extras.length === 0) {
                          remove(index);
                          return;
                        }
                        Modal.confirm({
                          title: '提示',
                          icon: <ExclamationCircleOutlined />,
                          content: '章节内的课件内容将被同步删除',
                          okText: '确认',
                          onOk: () => remove(index),
                          cancelText: '取消',
                        });
                      }}
                      className="icon-option"
                    />
                  </Space>
                </div>
              </div>
              {p.isOpen && (
                <div>
                  {p.extras.map((file, _) => (
                    <div key={'title-extra' + _} style={{ padding: '5px 10px' }}>
                      <Space size={10}>
                        {getFileIcon(file.title)}
                        {file.title}
                      </Space>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Card>
      </div>
    );
  };

  const options = () => {
    return (
      <div>
        <Card
          type="inner"
          title="编辑框"
          bodyStyle={{
            minHeight: 'calc(100vh - 462px)',
          }}
        >
          {editingItem === undefined && (
            <Empty className="empty" description="请先在左边操作框新建/选择章节" />
          )}
          {editingItem !== undefined && (
            <Form form={form} layout={'vertical'} onFieldsChange={editChapter}>
              <Form.Item name="title" label="标题">
                <Input placeholder="请输入" maxLength={35} />
              </Form.Item>
              <Form.Item name="description" label="章节简介">
                <Input.TextArea
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  showCount
                  maxLength={200}
                />
              </Form.Item>
              <div
                style={{
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center',
                  margin: '10px 0',
                }}
              >
                <span>课件</span>
                <Button
                  icon={<UploadOutlined />}
                  type="primary"
                  onClick={() => setModalVisible(true)}
                >
                  上传课件
                </Button>
              </div>
              <div
                style={{
                  padding: 20,
                  marginBottom: 10,
                  border: '1px dashed #999',
                  borderRadius: '5px',
                }}
              >
                {editingItem?.extras.length === 0 && <Empty description="请先上传课件" />}

                {editingItem?.extras.map((p, index) => (
                  <div
                    key={'extra' + index}
                    style={{ justifyContent: 'space-between', display: 'flex', padding: 5 }}
                  >
                    <div style={{ alignItems: 'center', display: 'flex' }}>
                      <Space style={{ padding: '5px 10px' }} size={10}>
                        {getFileIcon(p.title)}
                        {p.isEditing ? (
                          <Input
                            defaultValue={p.title}
                            onChange={(e) => {
                              // 编辑
                              const extras = [...editingItem?.extras];
                              extras.splice(index, 1, {
                                ...p,
                                title: e.target.value,
                              });
                              save('extras', (editingItem?.sort || 0) - 1, extras);
                            }}
                          />
                        ) : (
                          <span>{p.title}</span>
                        )}
                      </Space>
                    </div>

                    <Space size={10}>
                      {p.isEditing ? (
                        <span />
                      ) : (
                        <EditOutlined
                          onClick={() => {
                            // 编辑
                            const extras = [...editingItem?.extras];
                            const editingIndex = extras.findIndex((e) => e.isEditing);
                            if (editingIndex > -1) {
                              extras.splice(editingIndex, 1, {
                                ...extras[editingIndex],
                                isEditing: false,
                              });
                            }
                            extras.splice(index, 1, {
                              ...p,
                              isEditing: true,
                            });
                            save('extras', (editingItem?.sort || 0) - 1, extras);
                          }}
                        />
                      )}
                      <DeleteOutlined
                        onClick={() => {
                          const extras = [...editingItem?.extras];
                          extras.splice(index, 1);
                          save('extras', (editingItem?.sort || 0) - 1, extras);
                        }}
                      />
                    </Space>
                  </div>
                ))}
              </div>
              <Form.Item name="minTime" label="课件最低学习时间">
                <InputNumber
                  placeholder="请输入"
                  step={1}
                  min={1}
                  max={99999999}
                  precision={0}
                  addonAfter="秒"
                />
              </Form.Item>
            </Form>
          )}
        </Card>
        <div style={{ textAlign: 'center' }}>
          {editingCourse?.state ? (
            <Button
              style={{ marginTop: 10 }}
              type="primary"
              onClick={() => submitChapter(undefined, '保存')}
            >
              保存
            </Button>
          ) : (
            <Space size={10} style={{ padding: 10 }}>
              <Button
                type="primary"
                style={{ width: '100%' }}
                loading={addOrUpdateLoading}
                onClick={() => submitChapter(true, '上架')}
              >
                立即上架
              </Button>
              <Button style={{ width: '100%' }} onClick={() => submitChapter(false, '暂存')}>
                暂存
              </Button>
            </Space>
          )}
        </div>
      </div>
    );
  };

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
            title: p.name,
            storeId: p.response?.result,
            isEditing: false,
          } as CourseManage.File;
        });
        setFiles(upLoadResult);
        setUploadLoading(false);
      } else {
        setUploadLoading(false);
        message.error(`上传失败，原因:{${uploadResponse.message}}`);
      }
    }
  };

  const beforeUpload = (file: RcFile) => {
    return new Promise((resolve, reject) => {
      const lastName = file.name.split('.');
      const accepts = accept.split(',');
      console.log(lastName, lastName[lastName.length - 1]);
      if (!accepts.includes('.' + lastName[lastName.length - 1])) {
        message.error(`请上传以${accept}后缀名开头的文件`);
        return reject(false);
      }
      return resolve(true);
    });
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/iiep-manage/common/upload',
    onChange: handleChange,
    beforeUpload: beforeUpload,
    onDrop: (e: React.DragEvent) => {
      try {
        const fileList = (e.dataTransfer.files as FileList) || [];
        for (let index = 0; index < fileList.length; index++) {
          const file = fileList[index];
          const lastName = file.name.split('.');
          const accepts = accept.split(',');
          if (!accepts.includes('.' + lastName[lastName.length - 1])) {
            message.error(`${file.name}不符合标准，已忽略`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    onRemove: (file: UploadFile<any>) => {
      if (file.status === 'uploading' || file.status === 'error') {
        setUploadLoading(false);
      }
      const files_copy = [...files];
      const existIndex = files_copy.findIndex((p) => p.storeId === file?.response?.result);
      if (existIndex > -1) {
        files_copy.splice(existIndex, 1);
        setFiles(files_copy);
      }
    },
  };

  return (
    <div className="course-chapters">
      <Row gutter={10}>
        <Col span={6}>{settings()}</Col>
        <Col span={18}>{options()}</Col>
      </Row>
      <Modal
        title={'上传课件'}
        width="400px"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setFiles([]);
          // eslint-disable-next-line
          uploadLoading && setUploadLoading(false);
        }}
        centered
        destroyOnClose
        onOk={async () => {
          const file_merge = [...(editingItem?.extras || []), ...files];
          save('extras', (editingItem?.sort || 1) - 1, file_merge);
          setModalVisible(false);
        }}
        confirmLoading={uploadLoading}
      >
        <Dragger {...uploadProps} accept={accept}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">支持上传图片格式、mp3、mp4、PDF类型的课件</p>
        </Dragger>
      </Modal>
    </div>
  );
};
