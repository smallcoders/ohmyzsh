import {
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  DatePicker,
  message as antdMessage,
  Dropdown,
  Menu,
  Modal,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
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
import moment from 'moment';
import SelfTable from '@/components/self_table';
import { routeName } from '@/../config/routes';
// import PreviewModal from '../edit/components/PreviewModal';
import { listAllAreaCode } from '@/services/common';
const sc = scopedClasses('material-library');
const statusMap = {
  0: '未发布',
  1: '已发布',
};
const statusOptions = [
  {
    label: '未发布',
    value: '0',
  },
  {
    label: '已发布',
    value: '1',
  },
];

interface record {
  tmpId: string;
  tmpName: string;
  tmpDesc: string;
  state: string | number;
  updateTime: string;
  tmpJson: string;
}

export default () => {
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [openMenuId, setMenuOpen] = useState<any>('');
  const [areaCodeOptions, setAreaCodeOptions] = useState<any>({
    county: [],
    city: [],
    province: [],
  });
  const [templateJson, setTemplateJson] = useState<any>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [menuData, setMenuData] = useState<any>([]);
  const history = useHistory();
  const [searchForm] = Form.useForm();
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });
  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getPageList({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      if (code === 0) {
        setPageInfo({ totalCount, pageTotal, pageIndex, pageSize });
        setDataSource(result);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };

  const handlePublish = (record: record) => {
    addOperationLog({
      tmpId: record.tmpId,
      type: 2,
    });
    modifyTemplateState({
      tmpId: record.tmpId,
      state: 1,
    }).then((res) => {
      if (res.code === 0) {
        antdMessage.success(`发布成功`);
        history.push(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${record.tmpId}`);
      } else {
        antdMessage.error(`${res.message}`);
      }
    });
  };
  const checkLink = (record: record) => {
    window.open(`${routeName.PAGE_CREAT_MANAGE_PUBLISH}?id=${record.tmpId}`);
  };
  const checkData = (record: record) => {
    getTemplateData({
      pageSize: 1,
      pageIndex: 1,
      tmpId: record.tmpId,
    }).then((res) => {
      const { result } = res;
      if (res.code === 0) {
        if (!result.data) {
          Modal.info({
            title: '提示',
            content: '此表单暂时还没有答卷',
            okText: '我知道了',
          });
        } else {
          history.push(
            `${routeName.PAGE_CREAT_MANAGE_PAGE_DATA}?tmpName=${encodeURIComponent(
              record.tmpName,
            )}&id=${record.tmpId}`,
          );
        }
      } else {
        antdMessage.error(`${res.message}`);
      }
    });
  };

  const handleDelete = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '删除后用户将不能填写，表单及其数据也将无法恢复，确认删除？',
      okText: '删除',
      onOk: () => {
        modifyTemplateState({
          tmpId: record.tmpId,
          state: 2,
        }).then((res) => {
          if (res.code === 0) {
            antdMessage.success(`删除成功`);
            const { totalCount, pageIndex, pageSize } = pageInfo;
            const newTotal = totalCount - 1;
            const newPageTotal = Math.ceil(newTotal / pageSize);
            getPage(pageIndex > newPageTotal ? newPageTotal : pageIndex);
          } else {
            antdMessage.error(`${res.message}`);
          }
        });
      },
    });
  };

  const handleEdit = (record: record) => {
    addOperationLog({
      tmpId: record.tmpId,
      type: 0,
    }).then(() => {
      history.push(`${routeName.PAGE_CREAT_MANAGE_EDIT}?id=${record.tmpId}`);
    });
  };

  const handleDrop = (record: record) => {
    Modal.confirm({
      title: '提示',
      content: '下架后用户将不能填写，确认下架？若重新发布，之前的分享链接还可继续使用？',
      okText: '下架',
      onOk: () => {
        addOperationLog({
          tmpId: record.tmpId,
          type: 1,
        });
        modifyTemplateState({
          tmpId: record.tmpId,
          state: 0,
        }).then((res) => {
          if (res.code === 0) {
            antdMessage.success(`下架成功`);
            getPage(pageInfo.pageIndex);
          } else {
            antdMessage.error(`${res.message}`);
          }
        });
      },
    });
  };

  const menuItemClick = (type: string, record: record) => {
    if (type === 'drop') {
      handleDrop(record);
    }
    if (type === 'delete') {
      handleDelete(record);
    }
    if (type === 'edit') {
      handleEdit(record);
    }
  };

  const getButtonList = (record: record) => {
    const buttonTypeList =
      record.state === 0
        ? [
            { type: 'publish' },
            { type: 'data_manage' },
            {
              type: 'more',
              children: [
                { type: 'delete', text: '删除' },
                { text: '编辑', type: 'edit' },
              ],
            },
          ]
        : [
            { type: 'link' },
            { type: 'data_manage' },
            {
              type: 'more',
              children: [
                { type: 'drop', text: '下架' },
                { text: '删除', type: 'delete' },
              ],
            },
          ];
    return buttonTypeList.map((item: any) => {
      if (item.type === 'publish') {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              handlePublish(record);
            }}
          >
            发布
          </Button>
        );
      }
      if (item.type === 'link') {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              checkLink(record);
            }}
          >
            查看链接
          </Button>
        );
      }
      if (item.type === 'data_manage') {
        return (
          <Button
            size="small"
            type="link"
            onClick={() => {
              checkData(record);
            }}
          >
            数据管理
          </Button>
        );
      }
      if (item.type === 'more') {
        const { children } = item;
        const menu = (
          <Menu>
            {children.map((child: { type: string; text: string }) => {
              return (
                <Menu.Item
                  onClick={() => {
                    menuItemClick(child.type, record);
                  }}
                >
                  {child.text}
                </Menu.Item>
              );
            })}
          </Menu>
        );
        return (
          <Dropdown overlay={menu}>
            <a>
              更多 <DownOutlined />
            </a>
          </Dropdown>
        );
      }
      return null;
    });
  };

  useEffect(() => {
    listAllAreaCode().then((res) => {
      if (res?.result) {
        const { result } = res;
        const city: any = [];
        const province: any = [];
        result.forEach((item: any) => {
          city.push({
            ...item,
            nodes: item.nodes?.map((node: any) => {
              const { nodes, ...reset } = node;
              return reset;
            }),
          });
          const { nodes, ...reset } = item;
          province.push(reset);
        });
        setAreaCodeOptions({
          county: result,
          city,
          province,
        });
      }
    });
  }, []);
  useEffect(() => {
    getPage();
  }, [searchContent]);

  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-table-header')}>
        <div className="title">
          <div>
            <span className="count">图片（共X张）</span>
          </div>
          <div>
            <span className='tips'>图片大小限制不超过10M</span>
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
      </div>

      <div className={sc('container-table-body')}>
        
        {/* <PreviewModal
          title="预览"
          footer={null}
          visible={previewVisible}
          json={templateJson}
          onCancel={() => {
            setPreviewVisible(false)
          }}
          areaCodeOptions={areaCodeOptions}
        /> */}
      </div>
    </PageContainer>
  );
};
