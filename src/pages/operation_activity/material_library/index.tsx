import {
  Button,
  Form,
  Radio,
  message as antdMessage,
  Dropdown,
  Menu,
  Modal,
  Popconfirm,
  Input,
} from 'antd';
import {
  FolderAddOutlined,
  SettingOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  getPageList,
  modifyTemplateState,
  getTemplateData,
  getTemplateOperationList,
  addOperationLog,
} from '@/services/page-creat-manage';
import type MaterialLibrary from '@/types/material-library';
import FormItem from 'antd/lib/form/FormItem';
import EditGroupModal from './components/EditGroupModal';
const sc = scopedClasses('material-library');

interface record {
  tmpId: string;
  tmpName: string;
  tmpDesc: string;
  state: string | number;
  updateTime: string;
  tmpJson: string;
}

export default () => {
  const [isMore, setIsMore] = useState(false);
  const [addGroupForm] = Form.useForm();
  const [searchContent, setSearChContent] = useState<any>({});
  const [editGroupVisible, setEditGroupVisible] = useState(false);

  const getPage = async () => {
    // try {
    //   const { result, totalCount, pageTotal, code, message } = await getPageList({
    //     pageIndex,
    //     pageSize,
    //     ...searchContent,
    //   });
    //   if (code === 0) {
    //     setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
    //     setDataSource(result);
    //   } else {
    //     throw new Error(message);
    //   }
    // } catch (error) {
    //   antdMessage.error(`请求失败，原因:{${error}}`);
    // }
  };

  useEffect(() => {
    // getPage();
  }, [searchContent]);

  // 选择分组
  const onChangeGroup = (e: any) => {
    console.log(e.target.value);
  };
  const addGroup = async () => {
    const values = await addGroupForm.validateFields();
    console.log(values);
  };
  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <div>
            <span className="count">图片（共X张）</span>
          </div>
          <div>
            <span className="tips">图片大小限制不超过10M</span>
            <Button
              type="primary"
              onClick={() => {
                // 上传图片 打开弹框
              }}
            >
              上传
            </Button>
          </div>
        </div>
        <div className="group">
          <div className="left">
            <span className="title">分组</span>
            <div style={{ width: '84%' }}>
              <Radio.Group onChange={onChangeGroup} defaultValue="a">
                <Radio.Button value="a">Hangzhou</Radio.Button>
                <Radio.Button value="b">Shanghai</Radio.Button>
                <Radio.Button value="c">Beijing</Radio.Button>
                <Radio.Button value="d">Chengdu</Radio.Button>
                <Radio.Button value="a">Hangzhou</Radio.Button>
                <Radio.Button value="c">Beijing</Radio.Button>
                <Radio.Button value="d">Chengdu</Radio.Button>
                <Radio.Button value="a">Hangzhou</Radio.Button>
                {isMore && (
                  <>
                    <Radio.Button value="a">Hangzhou</Radio.Button>
                    <Radio.Button value="b">Shanghai</Radio.Button>
                    <Radio.Button value="c">Beijing</Radio.Button>
                    <Radio.Button value="d">Chengdu</Radio.Button>
                    <Radio.Button value="a">Hangzhou</Radio.Button>
                    <Radio.Button value="b">Shanghai</Radio.Button>
                    <Radio.Button value="c">Beijing</Radio.Button>
                    <Radio.Button value="d">Chengdu</Radio.Button>
                    <Radio.Button value="a">Hangzhou</Radio.Button>
                    <Radio.Button value="b">Shanghai</Radio.Button>
                    <Radio.Button value="c">Beijing</Radio.Button>
                    <Radio.Button value="d">Chengdu</Radio.Button>
                  </>
                )}

                {/* {groupList.map((item)=> {
              return (
                <Radio.Button value="item.id">{{item.name}}</Radio.Button>
              );
            })} */}
              </Radio.Group>
              <div style={{ textAlign: 'center' }}>
                <Button
                  type="link"
                  onClick={() => {
                    setIsMore(!isMore);
                  }}
                >
                  {isMore ? '收起' : '展开'}
                  {isMore ? <CaretUpOutlined /> : <CaretDownOutlined />}
                </Button>
              </div>
            </div>
          </div>
          <div className="right">
            <div>
              <FolderAddOutlined style={{ color: '#6680FF' }} />
              <Popconfirm
                placement="bottom"
                overlayClassName="add-group"
                title={
                  <>
                    <Form form={addGroupForm} layout="vertical" validateTrigger={['onBlur']}>
                      <FormItem
                        label="请输入分组名称"
                        name="111"
                        colon={false}
                        rules={[
                          {
                            validator(rule, value, callback) {
                              if (!value) {
                                return Promise.reject('名称不能为空');
                                // 判断value值是否在分组里存在
                                // } else if() {}
                                //  return Promise.reject('该分组名称已存在');
                              }
                            },
                          },
                        ]}
                      >
                        <Input showCount maxLength={8} />
                      </FormItem>
                    </Form>
                  </>
                }
                icon={false}
                onConfirm={() => {
                  // 点击确定新建分组
                  addGroup();
                  addGroupForm.resetFields();
                }}
                onCancel={() => {
                  addGroupForm.resetFields();
                }}
                okText="确定"
                cancelText="取消"
              >
                <Button type="link">新建分组</Button>
              </Popconfirm>
            </div>
            <div>
              <SettingOutlined style={{ color: '#6680FF' }} />
              <Button
                type="link"
                onClick={() => {
                  setEditGroupVisible(true);
                }}
              >
                管理分组
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={sc('container-table-body')}></div>
      <EditGroupModal
        visible={editGroupVisible}
        handleCancel={() => setEditGroupVisible(false)}
      />
    </PageContainer>
  );
};
