import {
  Button,
  Form,
  Radio,
  message as antdMessage,
  Popover,
  Popconfirm,
  Input,
  List,
  Card,
  Image,
  Checkbox,
  Space,
  message,
  Empty,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  PlusCircleOutlined,
  ZoomInOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  EllipsisOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState, useRef } from 'react';
import {
  totalNumber,
  listAll,
  materialList,
  addMaterialGroup,
  deleteBatch,
  renameMaterial,
} from '@/services/material-library';
import type Common from '@/types/common';
import type MaterialLibrary from '@/types/material-library';
import FormItem from 'antd/lib/form/FormItem';
import empty from '@/assets/financial/empty.png';
import EditGroupModal from './components/EditGroupModal';
import MoveGroupModal from './components/MoveGroupModal';
import BigImgVisible from './components/BigImgModal';
import UploadImg from './components/UploadImg';
import { ProList } from '@ant-design/pro-components';
const sc = scopedClasses('material-library');

export default () => {
  const [totalNum, setTotalNum] = useState(0);
  const [isMore, setIsMore] = useState(false);
  const [groupsId, setGroupsId] = useState<number | null>(null);
  const [uploadGroupsId, setUploadGroupsId] = useState<number | null>(null);
  const [groupListAll, setGroupListAll] = useState<MaterialLibrary.List[]>([]);
  const [dataSource, setDataSource] = useState<MaterialLibrary.Content[]>([]);
  const [editGroupVisible, setEditGroupVisible] = useState(false);
  const [moveGroupVisible, setMoveGroupVisible] = useState(false);
  const [bigImgVisible, setBigImgVisible] = useState(false);
  const [uploadGroupVisible, setUploadGroupVisible] = useState(false);
  const [addGroupVisible, setAddGroupVisible] = useState(false);
  const [renameVisibleId, setRenameVisibleId] = useState(-1);
  const [moreVisibleId, setMoreVisibleId] = useState(-1);
  const [selectImg, setSelectImg] = useState<any>([]);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);
  const [imgId, setImgId] = useState<number>();
  const [delImgId, setDelImgId] = useState<any>(null);
  const [imgInfo, setImgInfo] = useState<MaterialLibrary.Content>({});
  const [type, setType] = useState<string>('');
  const [addGroupForm] = Form.useForm();
  const [editphotoForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const groupRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<any>(null);
  // 列表
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const {
        result,
        totalCount,
        pageTotal,
        code,
        message: resultMsg,
      } = await materialList({
        pageIndex,
        pageSize,
        groupsId,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(resultMsg);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  const getTotalNumber = async () => {
    try {
      const { result, code, message: resultMsg } = await totalNumber();
      if (code === 0) {
        setTotalNum(result);
      } else {
        throw new Error(resultMsg);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  const getGroupListAll = async () => {
    try {
      const { result, code, message: resultMsg } = await listAll();
      if (code === 0) {
        setGroupListAll(result);
        if (groupsId === null) {
          setGroupsId(result[0].id);
        }
      } else {
        throw new Error(resultMsg);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  useEffect(() => {
    if (groupRef?.current && groupRef?.current?.offsetHeight > 33) {
      setShowMoreButton(true);
      setIsMore(true);
    } else {
      setShowMoreButton(false);
      setIsMore(false);
    }
  }, [groupListAll]);

  useEffect(() => {
    getTotalNumber();
    getGroupListAll();
  }, []);
  useEffect(() => {
    getPage();
  }, [groupsId]);
  // 新建分组
  const addGroup = async () => {
    const value = await addGroupForm.validateFields();
    try {
      const { code } = await addMaterialGroup(value);
      if (code === 0) {
        message.success('新建分组成功！');
        getGroupListAll();
        setAddGroupVisible(false);
        addGroupForm.resetFields();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 编辑图片名称
  const editPhoto = async (materialId: number) => {
    const { rename } = await editphotoForm.validateFields();
    try {
      const { code } = await renameMaterial(materialId, rename);
      if (code === 0) {
        message.success('重命名成功！');
        setRenameVisibleId(-1);
        setMoreVisibleId(-1);
        editphotoForm.resetFields();
        getPage();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 选中图片
  const onChangeImg = (id: number) => {
    if (selectImg.indexOf(id) > -1) {
      const arr = selectImg.filter((key: number) => key !== id);
      setSelectImg(arr);
      return;
    }
    setSelectImg(selectImg.concat(id));
  };
  // 批量删除
  const batchDel = async () => {
    if (type === 'single') {
      if (selectImg.includes(delImgId)) {
        selectImg.splice(selectImg.indexOf(delImgId), 1);
      }
    }
    try {
      const { code } = await deleteBatch(type === 'single' ? [delImgId] : selectImg);
      if (code === 0) {
        message.success('删除图片成功！');
        if (type === 'multiple') {
          setSelectImg([]);
        } else {
          setDelImgId(null);
        }
        getTotalNumber();
        getGroupListAll();
        getPage();
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 完成上传
  const finish = async () => {
    if (groupsId === uploadGroupsId) {
      getPage();
    } else {
      setGroupsId(uploadGroupsId);
    }
    getGroupListAll();
    getTotalNumber();
  };
  // 图片更多
  const getContent = (item: MaterialLibrary.Content) => {
    return (
      <div className="more">
        {/* 重命名 */}
        <span onClick={(e: any) => e.stopPropagation()}>
          <Popover
            key={item.id}
            visible={renameVisibleId === item.id}
            placement="rightTop"
            overlayClassName={sc('rename')}
            trigger="click"
            title={false}
            content={
              <>
                <Form form={editphotoForm} layout="vertical" validateTrigger={['onBlur']}>
                  <FormItem
                    label="请输入图片名称"
                    name="rename"
                    colon={false}
                    rules={[
                      {
                        validator(rule, value) {
                          if (!value) {
                            return Promise.reject('名称不能为空');
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <Input ref={inputRef} showCount maxLength={35} placeholder="请输入" />
                  </FormItem>
                  <Row>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button
                          size="small"
                          onClick={() => {
                            setRenameVisibleId(-1);
                            setMoreVisibleId(-1);
                            editphotoForm.resetFields();
                          }}
                        >
                          取消
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            editPhoto(item.id);
                          }}
                          type="primary"
                        >
                          确定
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </Form>
              </>
            }
            onVisibleChange={(visible) => {
              if (visible) {
                setRenameVisibleId(item.id);
              } else {
                setRenameVisibleId(-1);
                editphotoForm.resetFields();
              }
            }}
          >
            <div
              onClick={async (e) => {
                e.stopPropagation();
                editphotoForm.setFieldsValue({ rename: item.name });
                await setRenameVisibleId(item.id);
                console.log(inputRef.current.input.value);
                inputRef.current!.focus({
                  cursor: 'all',
                });
              }}
            >
              重命名
            </div>
          </Popover>
        </span>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setImgId(item.id);
            setType('single');
            setMoveGroupVisible(true);
          }}
        >
          移动分组
        </div>
        <span onClick={(e: any) => e.stopPropagation()}>
          <Popconfirm
            placement="rightTop"
            title={
              <div>
                <span style={{ color: '#1e232a', fontSize: 16, fontWeight: 700 }}>提示</span>
                <br />
                你确定要删除吗？
              </div>
            }
            okText="确定"
            cancelText="取消"
            onConfirm={() => {
              setMoreVisibleId(-1);
              batchDel();
            }}
            onCancel={() => {
              setMoreVisibleId(-1);
              setType('');
              setDelImgId(null);
            }}
          >
            <div
              onClick={(e) => {
                e.stopPropagation();
                setType('single');
                setDelImgId(item.id);
              }}
            >
              删除
            </div>
          </Popconfirm>
        </span>
      </div>
    );
  };

  return (
    <PageContainer
      className={sc('container')}
      ghost
      header={{
        title: '素材库',
        breadcrumb: {},
      }}
    >
      <div className={sc('container-table-header')}>
        <div className="title">
          <div>
            <span className="count">图片（共{totalNum}张）</span>
          </div>
          <div>
            <span className="tips">图片大小限制不超过10M</span>
            <Popconfirm
              visible={uploadGroupVisible}
              placement="bottomRight"
              overlayClassName={sc('upload-img')}
              title={
                <>
                  <div className="title">
                    <div className="title-name">请选择目标分组</div>
                    <div
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        setUploadGroupsId(null);
                        setUploadGroupVisible(false);
                      }}
                    >
                      <CloseOutlined />
                    </div>
                  </div>
                  <UploadImg
                    multiple={true}
                    maxSize={2}
                    accept=".png,.jpeg,.jpg"
                    groupsId={uploadGroupsId}
                    finish={finish}
                  >
                    {groupListAll.map((item: MaterialLibrary.List) => {
                      return (
                        // eslint-disable-next-line react/jsx-key
                        <div
                          key={item.id}
                          className="group"
                          onClick={() => {
                            setUploadGroupsId(item.id);
                            setUploadGroupVisible(false);
                          }}
                        >
                          {item.groupName}
                        </div>
                      );
                    })}
                  </UploadImg>
                </>
              }
              icon={false}
              showCancel={false}
            >
              <Button type="primary" onClick={() => setUploadGroupVisible(true)}>
                + 上传
              </Button>
            </Popconfirm>
          </div>
        </div>
        <div className="group">
          <div className="left">
            <div
              ref={groupRef}
              className={`group-list ${showMoreButton ? ' ellipsis' : ''} ${
                isMore ? ' pack-up' : ''
              }`}
            >
              {groupListAll.map((item: MaterialLibrary.List) => {
                return (
                  <span
                    className={`group-item ${groupsId === item.id && 'active'}`}
                    key={item.id}
                    onClick={() => {
                      setGroupsId(item.id);
                    }}
                  >
                    {item.groupName + ' ' + item.materialCount}
                  </span>
                );
              })}
            </div>
            {showMoreButton && (
              <Button
                type="link"
                onClick={() => {
                  setIsMore(!isMore);
                }}
                style={{ color: '#1E232A' }}
              >
                {isMore ? (
                  <>
                    <span>展开更多</span>
                    <CaretDownOutlined />
                  </>
                ) : (
                  <>
                    <span>收起更多</span>
                    <CaretUpOutlined />
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="right">
            <Popover
              visible={addGroupVisible}
              placement="bottomRight"
              overlayClassName={sc('add-group')}
              trigger="click"
              title={false}
              content={
                <>
                  <Form form={addGroupForm} layout="vertical" validateTrigger={['onBlur']}>
                    <FormItem
                      label="请输入分组名称"
                      name="groupName"
                      colon={false}
                      rules={[
                        {
                          validator(rule, value) {
                            if (!value) {
                              return Promise.reject('名称不能为空');
                            } else if (groupListAll.some((item: any) => item.groupName === value)) {
                              return Promise.reject('该分组名称已存在');
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <Input showCount maxLength={8} placeholder="请输入" />
                    </FormItem>
                    <Row>
                      <Col span={24} style={{ textAlign: 'right' }}>
                        <Space>
                          <Button
                            size="small"
                            onClick={() => {
                              setAddGroupVisible(false);
                              addGroupForm.resetFields();
                            }}
                          >
                            取消
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              addGroup();
                            }}
                            type="primary"
                          >
                            确定
                          </Button>
                        </Space>
                      </Col>
                    </Row>
                  </Form>
                </>
              }
              onVisibleChange={(visible) => {
                if (!visible) {
                  addGroupForm.resetFields();
                }
                setAddGroupVisible(visible);
              }}
            >
              <div onClick={() => setAddGroupVisible(true)}>
                <PlusCircleOutlined style={{ color: '#556377', verticalAlign: 'middle' }} />
                &nbsp;新建
              </div>
            </Popover>

            <div
              onClick={() => {
                setEditGroupVisible(true);
              }}
            >
              <img src={require('@/assets/operate_data/template/mng.png')} />
              &nbsp;管理分组
            </div>
          </div>
        </div>
      </div>

      <div className={sc('container-table-body')}>
        {/* 全局操作栏 */}
        {selectImg.length > 0 && (
          <div className="all-action">
            <div>
              已选择
              <span style={{ color: '#0068FF' }}> {selectImg.length} </span>项
              <button
                onClick={() => {
                  setSelectImg([]);
                }}
              >
                取消选择
              </button>
            </div>
            <div>
              <Space>
                <Popconfirm
                  placement="bottomRight"
                  title={
                    <div>
                      <span style={{ color: '#1e232a', fontSize: 16, fontWeight: 700 }}>提示</span>
                      <br />
                      你确定要删除吗？
                    </div>
                  }
                  onConfirm={() => {
                    batchDel();
                  }}
                  onCancel={() => {
                    setType('');
                  }}
                >
                  <button
                    style={{ color: '#FF4F17' }}
                    onClick={() => {
                      setType('multiple');
                    }}
                  >
                    删除
                  </button>
                </Popconfirm>
                <button
                  style={{ marginLeft: 0 }}
                  onClick={() => {
                    setType('multiple');
                    setMoveGroupVisible(true);
                  }}
                >
                  移动
                </button>
              </Space>
            </div>
          </div>
        )}
        {/* 图片列表 */}
        {dataSource.length > 0 ? (
          <ProList<any>
            grid={{ gutter: 18, column: 5 }}
            rowKey="name"
            dataSource={dataSource}
            renderItem={(item) => (
              <List.Item>
                <Card bordered={false}>
                  <div
                    className={`card-img ${selectImg.indexOf(item.id) !== -1 ? 'isSelect' : ''}`}
                  >
                    <Image
                      id={item.id}
                      className="img"
                      width={'100%'}
                      height={'100%'}
                      preview={false}
                      src={`/antelope-manage/common/download/${item.fileId}`}
                      alt={item.name}
                    />
                    <div
                      className="card-mask"
                      onClick={() => {
                        onChangeImg(item.id);
                      }}
                    >
                      <Checkbox
                        className={`select-action ${
                          selectImg.indexOf(item.id) !== -1 ? 'isSelectAction' : ''
                        }`}
                        checked={selectImg.indexOf(item.id) !== -1}
                      />
                      <div
                        className="big-action"
                        onClick={async (e) => {
                          e.stopPropagation();
                          await setImgInfo(item);
                          setBigImgVisible(true);
                        }}
                      >
                        <ZoomInOutlined />
                      </div>
                      <Popover
                        placement="bottomLeft"
                        title={false}
                        trigger="click"
                        content={getContent(item)}
                        overlayClassName="operation-img-popover"
                        visible={moreVisibleId === item.id}
                        onVisibleChange={(visible) => {
                          if (visible) {
                            setMoreVisibleId(item.id);
                          } else {
                            setMoreVisibleId(-1);
                            setRenameVisibleId(-1);
                          }
                        }}
                      >
                        <div
                          className="more-action"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMoreVisibleId(item.id);
                          }}
                        >
                          <EllipsisOutlined />
                        </div>
                      </Popover>
                      <span className="size-info">{item.photoWidth + '*' + item.photoHeight}</span>
                    </div>
                  </div>
                  <div className="card-imgName" title={item.name}>
                    {item.name}
                  </div>
                </Card>
              </List.Item>
            )}
            pagination={
              pageInfo.totalCount === 0
                ? false
                : {
                    onChange: getPage,
                    total: pageInfo.totalCount,
                    current: pageInfo.pageIndex,
                    pageSize: pageInfo.pageSize,
                    showTotal: () =>
                      `共${pageInfo.totalCount}条记录 第${pageInfo.pageIndex}/${
                        pageInfo.pageTotal || 1
                      }页`,
                  }
            }
          />
        ) : (
          <div className={sc('container-content-empty')}>
            <Empty
              image={empty}
              imageStyle={{
                height: 160,
              }}
            />
          </div>
        )}
      </div>
      <EditGroupModal
        visible={editGroupVisible}
        groupsId={groupsId}
        handleCancel={() => setEditGroupVisible(false)}
        getGroupList={(boolean: boolean) => {
          getGroupListAll();
          if (boolean) {
            getPage();
          } else {
            setGroupsId(groupListAll[0].id);
          }
        }}
      />
      <MoveGroupModal
        visible={moveGroupVisible}
        data={groupListAll}
        selectImg={selectImg}
        imgId={imgId}
        type={type}
        cancelMove={() => setMoveGroupVisible(false)}
        moveSuccess={() => {
          if (type === 'single') {
            if (selectImg.includes(imgId)) {
              selectImg.splice(selectImg.indexOf(imgId), 1);
            }
          } else {
            setSelectImg([]);
          }
          getGroupListAll();
          getPage();
          setMoveGroupVisible(false);
        }}
      />
      <BigImgVisible
        visible={bigImgVisible}
        imgInfo={imgInfo}
        cancelImg={() => setBigImgVisible(false)}
      />
    </PageContainer>
  );
};
