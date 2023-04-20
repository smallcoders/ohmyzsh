import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Button,
  Menu,
  Dropdown,
  Tabs,
  Breadcrumb,
  Form,
  Space,
  Popconfirm,
  message,
  Input,
  Affix,
  Radio,
  InputNumber,
  Spin,
  Modal
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import { Link, history, Prompt, useAccess, Access } from 'umi';
import './service-management.less';
import arrowdown from '@/assets/home/arrowdown.png';
import { routeName } from '../../../../../config/routes';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import type SolutionTypes from '@/types/solution';
import ProTable from '@ant-design/pro-table';
import UploadForm from '@/components/upload_form';
import { phoneVerifyReg } from '@/utils/regex-util';
import {
  httpArticleDrafList,
  httpServiceAccountPublishPage,
  httpServiceAccountArticleOffShelf,
  httpServiceAccountArticleDel,
  httpServiceAccountOperationSave,
  httpServiceAccountOperationSubmit,
  httpServiceAccountOperationDetail,
  httpServiceAccountManageNameAble,
} from '@/services/service-management';
const sc = scopedClasses('service-number-management');

type AuditType = '草稿箱' | '发布记录' | '服务号设置';
export default () => {
  const sortArrayByWeight = (arr: any) => {
    return arr.sort((a: any, b: any) => b.weight - a.weight);
  };

  const { TextArea } = Input;
  const { id, name } = history.location.query as { id: string | undefined };
  const access = useAccess();
  // 手动触发table 的 reload等操作
  const actionRef = useRef<ActionType>();

  // 是否为更新服务号
  const [update, setUpdata] = useState<boolean>(false);

  const [serveDetail, setServeDetail] = useState<any>();
  const detail = async () => {
    if (!id) return;
    try {
      const res = await httpServiceAccountOperationDetail(id);
      if (res?.code === 0) {
        console.log('获取渲染详情', res?.result);
        setUpdata(true);
        setServeDetail(res?.result);
      } else {
        throw new Error('');
      }
    } catch (error) {
      message.error(`获取详情失败:${error}`);
    }
  };
  // logo封面图
  const [imgUrl, setImgUrl] = useState<any>();
  const [imgUrlId, setImgUrlId] = useState<string>();
  useEffect(() => {
    if (serveDetail) {
      // 如果返回了Logo
      if (serveDetail?.logoUrl) {
        console.log('有图片')
        setImgUrl(serveDetail?.logoUrl);
        setImgUrlId(serveDetail?.logoId);
      }
      console.log('imgUrl', imgUrl)
      formBasic.setFieldsValue({
        ...serveDetail,
        // 服务号logo
        logoId: serveDetail?.logoUrl,
      });
      // 如果有详情
      // 初始化菜单设置
      const a = [
        {
          name: '添加菜单', // 菜单名称,
          key: 'delete',
        },
      ];
      const aa = [
        {
          name: '添加菜单', // 菜单名称
          // 没有menuLayer 的是子菜单
          contentType: 'TEXT', // 内容类型 TEXT:文本 PICTURE:图片 LINK:链接
          content: '', // 内容
          weight: null, // 排序权重,
          key: 'delete',
        },
      ];
      let menus = serveDetail?.menus;
      a.forEach((item: any) => {
        menus.push(item);
      });
      menus?.forEach((item: any) => {
        if (item.childMenu) {
          aa.forEach((item2: any) => {
            item.childMenu.push(item2);
          });
          // 初始化内容类型
          handleContentType('TEXT');
        }
      });
      // console.log('初始化菜单设置', menus);
      setDataSouceList(menus);
    }
  }, [serveDetail]);

  useEffect(() => {
    detail();
  }, []);

  const [drafLoading, setDrafLoading] = useState<boolean>(false);
  const getDraftList = async (id: any, reset?: boolean) => {
    setDrafLoading(true);
    try {
      const res = await httpArticleDrafList(id);
      if (res?.code === 0) {
        const list = res?.result;
        if (reset) {
          list.unshift({
            id: '0',
            type: 'add',
          });
        }
        const a = reset
          ? list?.map((item: any) => {
              return {
                id: item.id,
                type: item.type,
                bottom: item.type !== 'add',
                content: item.content,
                filePath: item.filePath,
                title: item.title,
                updateTime: item.updateTime,
              };
            })
          : draftsList.concat(res?.result)?.map((item: any) => {
              return {
                id: item.id,
                type: item.type,
                bottom: item.type !== 'add',
                content: item.content,
                filePath: item.filePath,
                title: item.title,
                updateTime: item.updateTime,
              };
            });
        // console.log('处理之后', a);
        setDraftsList(a);
        setDrafLoading(false);
      } else {
        throw new Error('');
      }
    } catch (error) {
      setDrafLoading(false);
      message.error(`获取草稿箱失败，原因:{${error}}`);
    }
  };

  const perpaers = () => {
    if (!id) return;
    getDraftList(id, false);
  };
  useEffect(() => {
    console.log('草稿箱接受的id', id);
    perpaers();
  }, []);
  /**
   * 当前的tab
   */
  const [activeTab, setActiveTab] = useState<AuditType>('草稿箱');

  // 草稿箱
  const [draftsList, setDraftsList] = useState<any>([
    {
      id: '0',
      type: 'add',
    },
  ]);

  const DraftsItem = (props: { dataSource?: any; id?: any }) => {
    const { dataSource, id } = props;

    const handleDeleta = async () => {
      try {
        const res = await httpServiceAccountArticleDel(dataSource.id);
        if (res?.code === 0) {
          await getDraftList(id, true);
          message.success('删除成功');
        } else {
          throw new Error('');
        }
      } catch (error) {
        message.error(`草稿箱删除失败：${error}`);
      }
    };

    const handleEdit = () => {
      console.log('编辑');
      history.push(
        `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DRAFTS_ADD}?type=edit&state=${dataSource.type}&id=${dataSource.id}&name=${name}`,
      );
      // window.open(
      //   `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DRAFTS_ADD}?type=edit&state=${dataSource.type}&id=${dataSource.id}&name=${name}`,
      // );
    };

    const addTypes = [
      {
        type: 'PICTURE_TEXT',
        name: '图文信息',
      },
      {
        type: 'PICTURE',
        name: '图片信息',
      },
      {
        type: 'TEXT',
        name: '文字消息',
      },
      {
        type: 'VIDEO',
        name: '视频消息',
      },
      {
        type: 'AUDIO',
        name: '音频消息',
      },
    ];
    // 草稿箱 新增
    const handleAddItem = (value: string) => {
      console.log('ADD', value);
      history.push(
        `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DRAFTS_ADD}?type=add&state=${value}&id=${id}&name=${name}`,
      );
    };
    const items = (
      <Menu>
        {addTypes?.map((item: any, index: any) => {
          return (
            <Menu.Item key={index}>
              <div onClick={() => handleAddItem(item.type)}>{item.name}</div>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <div className={sc('container-tab-drafts-item')}>
        <div className={sc('container-tab-drafts-item-content')}>
          {dataSource.type === 'add' && (
            <div className={sc('container-tab-drafts-item-content-add')}>
              <Dropdown overlay={items} placement="bottomRight" arrow trigger={['click']}>
                <Button type="primary" icon={<PlusOutlined />}>
                  新增内容
                </Button>
              </Dropdown>
            </div>
          )}
          <div className={sc('container-tab-drafts-item-content-img')}>
            {dataSource.type === 'PICTURE_TEXT' && dataSource.filePath && (
              // 图文
              <img
                className={sc('container-tab-drafts-item-content-img-url')}
                src={dataSource.filePath}
              />
            )}
            {dataSource.type === 'PICTURE' && dataSource.filePath && (
              // 图片
              <img
                className={sc('container-tab-drafts-item-content-img-url')}
                src={dataSource.filePath}
              />
            )}
            {dataSource.type === 'VIDEO' && dataSource.filePath && (
              // 视频
              <video controls="controls" width={320} height={134} src={dataSource.filePath}></video>
            )}
            {dataSource.type === 'AUDIO' && dataSource.filePath && (
              // 音频
              <audio controls={true} src={dataSource.filePath} />
            )}
            {dataSource.type === 'TEXT' && dataSource.content && <div>{dataSource.content}</div>}
          </div>
          {dataSource.title && (
            // 文本
            <div className={sc('container-tab-drafts-item-content-title')}>{dataSource.title}</div>
          )}
        </div>
        {dataSource.bottom && (
          <div className={sc('container-tab-drafts-item-bottom')}>
            <div className={sc('container-tab-drafts-item-bottom-left')}>
              更新于: {dataSource.updateTime || '---'}
            </div>
            <div className={sc('container-tab-drafts-item-bottom-right')}>
              <div className={sc('container-tab-drafts-item-bottom-right-delete')}>
                <Popconfirm
                  title="确定删除么？"
                  okText="确定"
                  cancelText="取消"
                  onConfirm={() => {
                    handleDeleta();
                  }}
                >
                  <Button block>删除</Button>
                </Popconfirm>
              </div>
              <div className={sc('container-tab-drafts-item-bottom-right-eidt')}>
                <Button type="primary" onClick={() => handleEdit()} block>
                  编辑
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 发布记录
  // const [formRelease] = Form.useForm();
  // 内容类型
  const typeEnum = {
    PICTURE_TEXT: '图文',
    PICTURE: '图片',
    TEXT: '文本',
    VIDEO: '视频',
    AUDIO: '音频',
  };
  // 状态
  const stateColumn = {
    NOT_SUBMITTED: '暂存',
    ON_SHELF: '已发布',
    OFF_SHELF: '已下架',
    APPOINTMENT_ON_SHELF: '预约发布',
  };
  const [total, setTotal] = useState<number>(0);
  const paginationRef = useRef<any>();
  const handleEditBtn = (item: any) => {
    console.log('编辑的当前值', item);
    history.push(
      `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DRAFTS_ADD}?type=edit&state=${item.type}&id=${item.id}&name=${name}`,
    );
    // window.open(
    //   `${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DRAFTS_ADD}?type=edit&state=${item.type}&id=${item.id}&name=${name}}`,
    // );
  };
  // 删除
  const remove = async (id: string) => {
    console.log('删除', id);
    try {
      const res = await httpServiceAccountArticleDel(id);
      if (res?.code === 0) {
        message.success(`删除成功`);
        if (total === 11) {
          actionRef.current?.reloadAndRest();
          return;
        }
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`删除失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 下架
  const addOrUpdataState = async (id: string) => {
    console.log('下架', id);
    try {
      const res = await httpServiceAccountArticleOffShelf(id);
      if (res?.code === 0) {
        message.success(`下架成功`);
        actionRef.current?.reload(); // 让table// 刷新
      } else {
        message.error(`下架失败，原因:{${res.message}}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // 详情
  const handleDetail = (id: string) => {
    console.log('详情', id);
    history.push(`${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DETAIL}?id=${id}`);
    // window.open(`${routeName.BASELINE_SERVICE_NUMBER_MANAGEMENT_DETAIL}?id=${id}`);
  };

  const columns: ProColumns<SolutionTypes.Solution>[] = [
    {
      title: '序号',
      align: 'center',
      hideInSearch: true, // 隐藏筛选
      renderText: (text: any, record: any, index: number) =>
        (paginationRef.current.current - 1) * paginationRef.current.pageSize + index + 1,
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      valueType: 'text', // 筛选的类别
    },
    {
      title: '内容类型',
      dataIndex: 'type',
      align: 'center',
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(typeEnum, _) ? typeEnum[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '发布服务号',
      dataIndex: 'serviceAccountName',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: 100,
      hideInSearch: true,
      renderText: (_: string) => {
        return (
          <div className={`state${_}`}>
            {Object.prototype.hasOwnProperty.call(stateColumn, _) ? stateColumn[_] : '--'}
          </div>
        );
      },
    },
    {
      title: '阅读数据',
      dataIndex: 'clickRate',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      hideInSearch: true, // 隐藏筛选
      align: 'center',
      width: 300,
      render: (_, record) => {
        return (
          <Space size="middle">
            {record?.state !== 'OFF_SHELF' && (
              <Button
                key="2"
                size="small"
                type="link"
                onClick={() => {
                  // 草稿的新新增页面
                  handleDetail(record.id.toString());
                }}
              >
                详情
              </Button>
            )}
            {/* 需要调整的权限 */}
            {/* <Access accessible={access['P_OA_DSXCY']}> */}
            <Button
              key="2"
              size="small"
              type="link"
              onClick={() => {
                // 草稿的新新增页面
                handleEditBtn(record);
              }}
            >
              编辑
            </Button>
            {/* </Access> */}
            {record?.state === 'ON_SHELF' && (
              <Popconfirm
                title={
                  <div>
                    <div>提示</div>
                    <div>确定将内容下架？</div>
                  </div>
                }
                okText="下架"
                cancelText="取消"
                onConfirm={() => addOrUpdataState(record.id.toString())}
              >
                <Button key="3" size="small" type="link">
                  下架
                </Button>
              </Popconfirm>
            )}
            {record?.state === 'APPOINTMENT_ON_SHELF' && (
              <Popconfirm
                title={
                  <div>
                    <div>提示</div>
                    <div>确定将内容撤回发布？</div>
                  </div>
                }
                okText="撤回发布"
                cancelText="取消"
                onConfirm={() => addOrUpdataState(record.id.toString())}
              >
                <Button key="3" size="small" type="link">
                  撤回发布
                </Button>
              </Popconfirm>
            )}
            {record?.state === 'OFF_SHELF' && (
              <Popconfirm
                title={
                  <div>
                    <div>删除</div>
                    <div>确定删除该发布内容？</div>
                  </div>
                }
                okText="确定"
                cancelText="取消"
                onConfirm={() => remove(record.id.toString())}
              >
                <a href="#">删除</a>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  const ReleaseRecord = (
    <div className={sc('container-tab-release')}>
      <ProTable
        headerTitle={`服务号设置管理列表（共${total}个）`}
        options={false} // 工具栏隐藏
        actionRef={actionRef} // 用来自定义触发
        rowKey="id"
        search={{
          span: 8,
          labelWidth: 100,
          defaultCollapsed: false, // 默认是否收起
          optionRender: (searchConfig, formProps, dom) => [dom[1], dom[0]],
        }}
        request={async (pagination) => {
          // 查询，重置搜集的值
          console.log('pagination', pagination);
          const result = await httpServiceAccountPublishPage({
            ...pagination,
            serviceAccountId: id && Number(id),
          });
          console.log('result', result);
          paginationRef.current = pagination;
          setTotal(result.total);
          return result;
        }}
        columns={columns}
        pagination={{ size: 'default', showQuickJumper: true, defaultPageSize: 10 }}
      />
    </div>
  );

  // 服务号设置
  const [formBasic] = Form.useForm();
  const formLayout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 8 },
  };
  const formLayoutMenu = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 },
  };
  // 服务号设置 - 暂存、提交
  const onSubmit = async (statue: number) => {
    if (statue === 1) {
      // 上架
      Promise.all([formBasic.validateFields()]).then(async ([formBasicValues]) => {
        if (dataSoueceList.length <= 1) {
          return message.warning('请配置菜单设置');
        }
        let a = JSON.stringify(dataSoueceList);
        let b = JSON.parse(a);
        let c = JSON.parse(a);
        b.forEach((item: any, index: any) => {
          if (item.key) {
            console.log('item', item.name);
            c.forEach((item2: any, index2: any) => {
              if (item2.name === item.name) {
                // 删除动态的index2
                c.splice(index2, 1);
              }
            });
          }
        });
        c = c.map((item: any) => {
          if (item.childMenu) {
            let a = JSON.stringify(item.childMenu);
            let b = JSON.parse(a);
            let c = JSON.parse(a);
            b.forEach((item2: any) => {
              if (item2.key) {
                c.forEach((item3: any, index3: any) => {
                  if (item3.name === item2.name) {
                    c.splice(index3, 1);
                  }
                });
              }
            });
            return {
              childMenu: c,
              menuLayer: item.menuLayer,
              name: item.name,
              weight: item.weight,
            };
          }
          return {
            content: item.content,
            contentType: item.contentType,
            menuLayer: item.menuLayer,
            name: item.name,
            weight: item.weight,
          };
        });

        try {
          const res = await httpServiceAccountOperationSubmit({
            id: id,
            ...formBasicValues,
            logoId: imgUrlId,
            menus: c,
          });
          if (res?.code === 0) {
            message.success('上架成功');
          } else if (res?.code === 1034) {
            message.warning('服务号内部名称不能重复');
          } else {
            message.error(`发布失败，原因:{${res?.message}}`);
          }
        } catch (error) {
          message.error(`发布失败，原因:{${error}}`);
        }
      });
    } else {
      // 暂存
      const formBasicValues = formBasic.getFieldsValue();

      let a = JSON.stringify(dataSoueceList);
      let b = JSON.parse(a);
      let c = JSON.parse(a);
      b.forEach((item: any, index: any) => {
        if (item.key) {
          console.log('item', item.name);
          c.forEach((item2: any, index2: any) => {
            if (item2.name === item.name) {
              // 删除动态的index2
              c.splice(index2, 1);
            }
          });
        }
      });
      c = c.map((item: any) => {
        if (item.childMenu) {
          let a = JSON.stringify(item.childMenu);
          let b = JSON.parse(a);
          let c = JSON.parse(a);
          b.forEach((item2: any) => {
            if (item2.key) {
              c.forEach((item3: any, index3: any) => {
                if (item3.name === item2.name) {
                  c.splice(index3, 1);
                }
              });
            }
          });
          return {
            childMenu: c,
            menuLayer: item.menuLayer,
            name: item.name,
            weight: item.weight,
          };
        }
        return {
          content: item.content,
          contentType: item.contentType,
          menuLayer: item.menuLayer,
          name: item.name,
          weight: item.weight,
        };
      });

      try {
        const res = await httpServiceAccountOperationSave({
          id: id,
          ...formBasicValues,
          logoId: imgUrlId,
          name: formBasicValues.name 
            ? formBasicValues.name.trim() 
              ? formBasicValues.name.trim() 
              : undefined
            : undefined,
          menus: c,
        });
        if (res?.code === 0) {
          message.success('暂存成功');
        } else {
          message.error(`发布失败，原因:{${res?.message}}`);
        }
      } catch (error) {
        message.error(`发布失败，原因:{${error}}`);
      }
    }
  };
  // 菜单项
  // 菜单的form
  /**
   * 菜单层级 true 单层 false 两层
   */
  const [isTry, setIsTry] = useState<number>();
  // 菜单层级了二级，隐藏发布时间
  const [contentShow, setContentShow] = useState<boolean>(true);
  // 根据菜单层级，展示内容
  useEffect(() => {
    if (isTry === 1) {
      setContentShow(true);
      return;
    }
    if (isTry === 2) {
      setContentShow(false);
    }
  }, [isTry]);
  const [formMunu] = Form.useForm();
  const [formMunuChilrden] = Form.useForm();
  const [dataSoueceList, setDataSouceList] = useState<any>([
    {
      name: '添加菜单', // 菜单名称,
      key: 'delete',
    },
  ]);
  const [childMunuDataList, setChildMunuDataList] = useState<any>([
    {
      name: '添加菜单', // 菜单名称
      // 没有menuLayer 的是子菜单
      contentType: 'TEXT', // 内容类型 TEXT:文本 PICTURE:图片 LINK:链接
      content: '', // 内容
      weight: null, // 排序权重,
      key: 'delete',
    },
  ]);
  useEffect(() => {
    setCurrentMenu({ name: '添加菜单' });
  }, []);
  // 当前选中的菜单项
  const [currentMenu, setCurrentMenu] = useState({});
  // 菜单项item
  const handleMenuItem = (item: any) => {
    console.log('点击了一级菜单当前项', currentMenu)
    // 清空子级
    setCurrentChilrden({});
    // 切换一级菜单
    setShowChilrdenMenuLayer(false);
    if (item.name === '添加菜单') {
      setIsTry(1);
      setContentShow(true);
      // 重置 form表单
      formMunu.resetFields();
      // 初始化内容类型
      handleContentType('TEXT');
      setCurrentMenu(item);
    } else {
      setCurrentMenu(item);
      if (item.childMenu) {
        // 有子菜单
        setIsTry(2);
        setContentShow(false);
        formMunu.setFieldsValue({ ...item, menuName: item.name });
      } else {
        // 无子菜单
        setIsTry(1);
        setContentShow(true);
        handleContentType(item.contentType);
        formMunu.setFieldsValue({ ...item, menuName: item.name });
        formMunu.setFieldsValue({ content: item.content });
      }
    }
  };
  // 当前增的菜单 是不是二级
  const [isTwo, setIsTwo] = useState(false);
  const handleMenuItemAdd = (item?: any, index?: any) => {
    if (currentMenu && currentMenu.name !== '添加菜单') {
      return;
    }
    // 添加之前校验表单
    formMunu.validateFields().then((values: any) => {
      let newItem = values;
      let a = JSON.stringify(dataSoueceList);
      let b = JSON.parse(a);
      if (values?.menuLayer === 2) {
        newItem.childMenu = childMunuDataList;
      }
      // b.unshift(newItem);
      b.splice(b.length - 1 , 0, newItem)
      const c = sortArrayByWeight(b);
      setDataSouceList(b);
      // 如果点了两层菜单，结束需要重置菜单状态
      handleMenuItem({
        name: '添加菜单',
      });
    });
  };
  const handleMenuItemDelete = () => {
    if (currentMenu && currentMenu.name === '添加菜单') {
      return;
    }
    let currentId;
    let a = JSON.stringify(dataSoueceList);
    let b = JSON.parse(a);
    b.forEach((item: any, index: any) => {
      if (item.name === currentMenu.name) {
        currentId = index;
      }
    });
    b.splice(currentId, 1);
    setDataSouceList(b);

    // 如果点了删除，让触发点击了菜单明称
    handleMenuItem({
      name: '添加菜单',
    });
  };
  // 编辑
  const handleMenuItemEdit = () => {
    if (currentMenu && currentMenu.name === '添加菜单') {
      return;
    }

    formMunu.validateFields().then((values: any) => {
      let currentId;
      let newItem = values;
      let a = JSON.stringify(dataSoueceList);
      let b = JSON.parse(a);
      console.log('一级菜单项currentMenu', currentMenu)
      if (currentMenu?.childMenu) {
        if (values?.menuLayer === 2) {
          // 如果还是选两层菜单，保留当前的子菜单
          newItem.childMenu = currentMenu?.childMenu;
          b.forEach((item: any, index: any) => {
            if (item.name === currentMenu.name) {
              currentId = index;
            }
          });
          b.splice(currentId, 1, newItem);
          const c = sortArrayByWeight(b);
          setDataSouceList(b);
        } else {
          // 改成了一层菜单
          newItem.childMenu = childMunuDataList;
          b.forEach((item: any, index: any) => {
            if (item.name === currentMenu.name) {
              currentId = index;
            }
          });
          b.splice(currentId, 1, newItem);
          const c = sortArrayByWeight(b);
          setDataSouceList(b);

        }
      } else {
        // 是否 选两层
        if (values?.menuLayer === 2) {
          newItem.childMenu = childMunuDataList;
        }
        b.forEach((item: any, index: any) => {
          if (item.name === currentMenu.name) {
            currentId = index;
          }
        });
        b.splice(currentId, 1, newItem);
        const c = sortArrayByWeight(b);
        setDataSouceList(b);
      }

      handleMenuItem({
        name: '添加菜单',
      });
    });
  };
  // 监听菜单List添加之后的后续处理
  useEffect(() => {
    if (!dataSoueceList) return;
    formMunu.resetFields();
    formMunuChilrden.resetFields();
    handleContentType('TEXT');
  }, [dataSoueceList, isTwo]);
  // 监听的标题 title
  const contentInfoFormTitle = Form.useWatch('contentType', formMunu);
  useEffect(() => {}, [contentInfoFormTitle]);

  // 监听左侧的当前选中的菜单, 对应展示右侧的form表单
  useEffect(() => {
    console.log('监听的一级菜单当前项', currentMenu);
  }, [currentMenu]);

  // 展示内容的当前项 // 文本 图片 链接
  const contentTypeList = [
    {
      name: '文本',
      label: 'TEXT',
    },
    {
      name: '图片',
      label: 'PICTURE',
    },
    {
      name: '链接',
      label: 'LINK',
    },
  ];
  const [contentType, setContentType] = useState('TEXT');
  const contentTypeOnChange = (value: any) => {
    if (value) {
      formMunu.setFieldsValue({ content: value });
    }
  };
  const coverOnChange = (value: any) => {
    console.log('图片当前的值', value);
  };
  // 内容类型
  const handleContentType = (value: any) => {
    setContentType(value);
    formMunu.setFieldsValue({ contentType: value });
    formMunuChilrden.setFieldsValue({ contentType: value });
  };
  useEffect(() => {
    // 初始化内容类型
    handleContentType('TEXT');
  }, []);

  //是否点击了二级菜单 控制右侧form的切换
  const [showChilrdenMenuLayer, setShowChilrdenMenuLayer] = useState(false);

  // 点击的当前二级菜单项
  const [currentChilrden, setCurrentChilrden] = useState({});
  // 当前已经添加的数量
  const [chilrdenCount, setChilrdenCount] = useState<number>(0);
  // 选择了子菜单的add
  const handleChilrdenMenuItemAdd = (value?: any, item?: any) => {
    console.log('子菜单项add', value, item);
    // 只有当前项选中了二级菜单名称，才可以点击添加菜单
    if (currentChilrden && currentChilrden.name !== '添加菜单') {
      return;
    }
    // 让当前的表单隐藏菜单层级
    formMunu.resetFields();
    // 切换form表单
    setShowChilrdenMenuLayer(true);
    // --------切换清空完成------
    // item: 当前的一级
    formMunuChilrden.validateFields().then((values: any) => {
      let a = JSON.stringify(dataSoueceList);
      let b = JSON.parse(a);
      // 当前一级的索引
      b?.forEach((j: any) => {
        if (j.name === currentMenu?.name) {
          // if (j.name === item?.name) {
          // 对应的一级的二级数组
          // j.childMenu.unshift(values);
          j.childMenu.splice(j.childMenu.length - 1, 0, values);
          const c = sortArrayByWeight(j.childMenu);
        }
      });
      // 当前二级的索引,
      setDataSouceList(b);
    });
  };
  // 监听当前菜单
  // useEffect(() => {
  //   console.log('dataSoueceList', dataSoueceList);
  // }, [dataSoueceList]);
  // 选择子菜单的储存当前一级
  const [childrenData, setChildrenData] = useState<any>();
  useEffect(() => {
    console.log('二级菜单，当前开启对应的一级', childrenData);
  }, [childrenData]);
  // 选择了子菜单
  const handleChilrdenMenuItem = (value?: any, index?: any, item?: any) => {
    console.log('子菜单项', value, index, item);
    // 子 当前的一级
    if (item) {
      console.log('子当前的一级', item);
      setChildrenData(item);
    }
    // 重置form表单
    formMunu.resetFields();
    // 保存当前的二级 对应的一级菜单
    setCurrentChilrden(value);
    // 切换右侧为子菜单
    setShowChilrdenMenuLayer(true);
    // 对应一级选中, 并选中一级下的二级表单名称
    setCurrentMenu(item);
    if (value.name === '添加菜单') {
      formMunuChilrden.resetFields();
      handleContentType('TEXT');
    } else {
      //切换内容类型
      handleContentType(value.contentType);
      formMunuChilrden.setFieldsValue({ ...value, menuName: value.name });
    }
  };
  // 删除子菜单
  const handleMenuChildItemDelete = () => {
    // 当前项选中了二级菜单名称，不可以删除
    if (currentChilrden && currentChilrden.name === '添加菜单') {
      return;
    }
    let currentId;
    let a = JSON.stringify(dataSoueceList);
    let b = JSON.parse(a);
    b?.forEach((j: any) => {
      if (j.name === currentMenu?.name) {
        // 对应的一级的二级数组
        j.childMenu.forEach((i: any, index: any) => {
          if (i.name === currentChilrden.name) {
            currentId = index;
          }
        });
      }
    });
    b?.forEach((j: any) => {
      if (j.name === currentMenu?.name) {
        j.childMenu.splice(currentId, 1);
      }
    });
    setDataSouceList(b);
    // 当触发当前的值
    handleChilrdenMenuItem(
      {
        name: '添加菜单',
      },
      currentId,
      currentMenu,
    );
  };
  // 编辑子菜单
  const handleMenuChildItemEdit = () => {
    // 当前项选中了二级菜单名称，不可以编辑
    if (currentChilrden && currentChilrden.name === '添加菜单') {
      return;
    }
    formMunuChilrden.validateFields().then((values: any) => {
      let newItem = values;
      let currentId;
      let a = JSON.stringify(dataSoueceList);
      let b = JSON.parse(a);
      b?.forEach((j: any) => {
        if (j.name === currentMenu?.name) {
          // 对应的一级的二级数组
          j.childMenu.forEach((i: any, index: any) => {
            if (i.name === currentChilrden.name) {
              currentId = index;
            }
          });
        }
      });
      b?.forEach((j: any) => {
        if (j.name === currentMenu?.name) {
          j.childMenu.splice(currentId, 1, newItem);
          const c = sortArrayByWeight(j.childMenu);
        }
      });
      setDataSouceList(b);
      handleChilrdenMenuItem(
        {
          name: '添加菜单',
        },
        currentId,
        currentMenu,
      );
    });
  };

  // 服务号名称的校验规则
  const changeFormMunuName = async (_: any, value: string) => {
    console.log('value', value)
    console.log('_', _)
    // value 是当前拿到的值
    // if (value) {
      // }
    if (!value.trim()) {
      message.warning('服务号名称不可为空格')
      return Promise.resolve();
    }
    try {
        const res = await httpServiceAccountManageNameAble({
          manage: false,
          name: value,
          id: serveDetail?.id,
        })
        if (res?.code === 0) {
          if (res?.result) {
            return Promise.resolve();
          } else {
            return Promise.reject(new Error('该服务号名称已存在'));
          }
        } else {
          message.warning(res?.message)
        }
    } catch (error) {
      message.error(`服务号名称校验失败:`,error)
      return Promise.reject(new Error('菜单名称重复'));
    }
  }
  const logoIdChange = (value: any) => {
    console.log('logoIdChange',value)
    setImgUrl(value)
  }
  const logoIdChangeId = (value: any) => {
    console.log('logoIdChangeId',value)
    setImgUrlId(value);
  }

  // 基础信息的改变
  const [infoFormChange, setnfoFormChange] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleTwo, setVisibleTwo] = useState<boolean>(false);
  // 监听当前的tab
  const [text, setText] = useState()
  useEffect(() => {
    if (activeTab === '服务号设置') {
      // 监听当前的菜单设置
      console.log('当前的TAB', activeTab)
      console.log('菜单设置', dataSoueceList)
      setText(dataSoueceList)
      let a = JSON.stringify(dataSoueceList);
    }
  },[activeTab, dataSoueceList])

  useEffect(() => {
    if (dataSoueceList && text) {
      // 并且更新
      console.log('并且更新', JSON.stringify(text) === JSON.stringify(dataSoueceList))
    }
  },[dataSoueceList])

  // 服务号设置
  const SetService = (
    <div className={sc('container-tab-set')}>
      <div className={sc('container-tab-set-top')}>
        <div className={sc('container-tab-set-top-title')}>服务号基本信息</div>
        <div className={sc('container-tab-set-top-form')}>
          <Form 
            form={formBasic} 
            {...formLayout} 
            validateTrigger={['onBlur']}
            onValuesChange={() => {
              setnfoFormChange(true);
            }}
          >
            <Form.Item 
              label="服务号名称" 
              name="name" 
              rules={[
                { required: true, message: '必填' },
                {
                  validator: changeFormMunuName,
                  message: '该服务号名称已存在',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Input maxLength={20} placeholder="请输入" allowClear />
            </Form.Item>
            <Form.Item
              label="服务号logo"
              name="logoId"
              rules={[{ required: true, message: '必填' }]}
            >
              <UploadForm
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                accept=".png,.jpeg,.jpg"
                tooltip={<span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>}
                setValue={(e) => logoIdChange(e)}
                setValueId={(e) => logoIdChangeId(e)}
              />
            </Form.Item>
            <Form.Item label="服务号介绍" name="introduction">
              <Input.TextArea
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength={300}
              />
            </Form.Item>
            <Form.Item
              label="客服电话"
              name="servicePhone"
              rules={[
                { required: true, message: '请输入' },
                {
                  pattern: phoneVerifyReg,
                  message: '请输入正确手机号',
                  validateTrigger: 'onBlur',
                },
              ]}
            >
              <Input
                style={{ width: '100%' }}
                placeholder="请输入"
                autoComplete="off"
                allowClear
                maxLength={35}
              />
            </Form.Item>
            <Form.Item label="所在地" name="address" rules={[{ required: true, message: '必填' }]}>
              <TextArea
                autoSize={{ minRows: 1, maxRows: 10 }}
                placeholder="请输入"
                maxLength={100}
              />
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className={sc('container-tab-set-menu')}>
        <div className={sc('container-tab-set-menu-header')}>菜单设置</div>
        <div className={sc('container-tab-set-menu-content')}>
          <div className={sc('container-tab-set-menu-content-left')}>
            <div className={sc('container-tab-set-menu-content-left-content')}>
              {/* <div className={sc('container-tab-set-menu-left-content-title')}>预览</div>
              <div>图片信息</div>
              <div>内容信息</div> */}
            </div>
            <div className={sc('container-tab-set-menu-content-left-menu')}>
              {true && (
                <div className={sc('container-tab-set-menu-content-left-menu-list')}>
                  {dataSoueceList &&
                    dataSoueceList.map((item: any, index: any) => {
                      const { childMenu } = item;
                      let overlayList;
                      if (childMenu) {
                        // 如果有子菜单
                        overlayList = (
                          <Menu>
                            {childMenu?.map((chilrdenItem: any, index: any) => {
                              // if (index >= 6) return
                              return (
                                <React.Fragment key={index}>
                                  {/* 二级菜单也分添加和菜单项 */}
                                  <Menu.Item>
                                    <div
                                      style={{
                                        color:
                                          currentChilrden?.name === chilrdenItem.name &&
                                          currentMenu?.name === item?.name
                                            ? '#6680ff'
                                            : '',
                                      }}
                                      onClick={() => {
                                        chilrdenItem.type
                                          ? handleChilrdenMenuItemAdd(chilrdenItem, item)
                                          : handleChilrdenMenuItem(chilrdenItem, index, item);
                                      }}
                                    >
                                      {chilrdenItem.name}
                                    </div>
                                  </Menu.Item>
                                </React.Fragment>
                              );
                            })}
                          </Menu>
                        );
                      }
                      if (index >= 4) return;
                      return (
                        <React.Fragment key={index}>
                          {
                            <div
                              className={sc('container-tab-set-menu-content-left-menu-list-item')}
                            >
                              {item.childMenu && (
                                <Dropdown
                                  visible={activeTab === '服务号设置'}
                                  trigger={['click']}
                                  overlay={overlayList}
                                  placement="top"
                                  arrow
                                >
                                  <span
                                    className={`${sc(
                                      'container-tab-set-menu-content-left-menu-list-item-text',
                                    )} ${currentMenu?.name === item.name ? 'current' : ''}`}
                                    onClick={() => {
                                      handleMenuItem(item);
                                    }}
                                  >
                                    {item.name}
                                  </span>
                                </Dropdown>
                              )}
                              {!item.childMenu && (
                                <span
                                  className={`${sc(
                                    'container-tab-set-menu-content-left-menu-list-item-text',
                                  )} ${currentMenu?.name === item.name ? 'current' : ''}`}
                                  onClick={() => {
                                    item.type
                                      ? handleMenuItemAdd(item, index)
                                      : handleMenuItem(item);
                                  }}
                                >
                                  {item.name}
                                </span>
                              )}
                            </div>
                          }
                        </React.Fragment>
                      );
                    })}
                  {!dataSoueceList && (
                    <div className={sc('container-tab-set-menu-content-left-menu-list-item')}>
                      菜单栏位置
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className={sc('container-tab-set-menu-content-right')}>
            {!showChilrdenMenuLayer && (
              <React.Fragment>
                {/* 一级菜单 */}
                <div className={sc('container-tab-set-menu-content-right-title')}>一级菜单</div>
                <div className={sc('container-tab-set-menu-content-right-form')}>
                  <Form 
                    form={formMunu} 
                    {...formLayoutMenu} 
                    validateTrigger={['onBlur']}
                    onValuesChange={() => {
                      setnfoFormChange(true);
                    }}
                  >
                    <Form.Item
                      label="菜单名称"
                      name="name"
                      rules={[
                        { required: true, message: '必填' },
                        // {
                        //   validator: changeFormMunuName,
                        //   message: '菜单名称不可重复',
                        //   validateTrigger: 'onBlur',
                        // },
                      ]}
                    >
                      <Input maxLength={20} placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                      label="菜单层级"
                      name="menuLayer"
                      // rules={[{ required: true, message: '必填' }]}
                    >
                      <Radio.Group onChange={(e) => setIsTry(e.target.value)}>
                        <Radio value={1}>单层菜单</Radio>
                        <Radio value={2}>两层菜单</Radio>
                      </Radio.Group>
                    </Form.Item>
                    {contentShow && (
                      <React.Fragment>
                        <Form.Item
                          label="内容类型"
                          name="contentType"
                          rules={[{ required: true, message: '必填' }]}
                        >
                          <div
                            className={sc(
                              'container-tab-set-menu-content-right-form-content-header',
                            )}
                          >
                            {contentTypeList?.map((item: any, index: any) => {
                              return (
                                <div
                                  className={`${sc(
                                    'container-tab-set-menu-content-right-form-content-header-item',
                                  )} ${contentType === item.label ? 'active' : ''}`}
                                  key={index}
                                  onClick={() => {
                                    handleContentType(item.label);
                                  }}
                                >
                                  {item.name}
                                </div>
                              );
                            })}
                          </div>
                        </Form.Item>
                        {contentType === 'TEXT' && (
                          <Form.Item
                            label="展示内容"
                            name="content"
                            rules={[{ required: true, message: '必填' }]}
                          >
                            <Input.TextArea
                              placeholder="请输入"
                              autoSize={{ minRows: 3, maxRows: 5 }}
                              maxLength={300}
                            />
                          </Form.Item>
                        )}
                        {contentType === 'LINK' && (
                          <Form.Item
                            label="展示内容"
                            name="content"
                            rules={[{ required: true, message: '必填' }]}
                          >
                            <Input placeholder="请输入" />
                          </Form.Item>
                        )}
                        {contentType === 'PICTURE' && (
                          <Form.Item
                            label="展示内容"
                            name="content"
                            rules={[{ required: true, message: '必填' }]}
                          >
                            <UploadForm
                              listType="picture-card"
                              className="avatar-uploader"
                              showUploadList={false}
                              accept=".png,.jpeg,.jpg"
                              tooltip={
                                <span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>
                              }
                              setValue={(e) => coverOnChange(e)}
                              onChange={(value: any) => {
                                contentTypeOnChange(value);
                              }}
                            />
                          </Form.Item>
                        )}
                      </React.Fragment>
                    )}
                    <Form.Item
                      label="权重"
                      name="weight"
                      rules={[{ required: true, message: '必填' }]}
                    >
                      <InputNumber
                        placeholder="请输入"
                        step={1}
                        min={1}
                        max={99999999}
                        precision={0}
                      />
                    </Form.Item>
                  </Form>
                  <div>
                    {/* <Button
                      onClick={() => {
                        handleMenuItemAdd();
                      }}
                    >
                      添加菜单
                    </Button> */}
                    <Popconfirm
                      title={
                        <div>
                          <div>删除</div>
                          <div>删除会将子菜单同步删除，确认删除？</div>
                        </div>
                      }
                      onConfirm={handleMenuItemDelete}
                      okText="删除"
                      cancelText="取消"
                    >
                      <Button>删除</Button>
                    </Popconfirm>
                    {(dataSoueceList?.length < 5 || currentMenu?.name !== '添加菜单') && (
                      <Button
                        style={{
                          marginLeft: '20px',
                        }}
                        onClick={() => {
                          currentMenu?.name === '添加菜单'
                            ? handleMenuItemAdd()
                            : handleMenuItemEdit();
                        }}
                      >
                        暂存菜单
                      </Button>
                    )}
                  </div>
                </div>
              </React.Fragment>
            )}
            {showChilrdenMenuLayer && (
              <React.Fragment>
                {/* 二级的form表单 */}
                <div className={sc('container-tab-set-menu-content-right-title')}>子菜单</div>
                <div className={sc('container-tab-set-menu-content-right-form')}>
                  {showChilrdenMenuLayer && (
                    <Form form={formMunuChilrden} {...formLayoutMenu} validateTrigger={['onBlur']}>
                      <Form.Item
                        label="子菜单名称"
                        name="name"
                        rules={[{ required: true, message: '必填' }]}
                      >
                        <Input maxLength={20} placeholder="请输入" allowClear />
                      </Form.Item>
                      {
                        <React.Fragment>
                          <Form.Item
                            label="内容类型"
                            name="contentType"
                            rules={[{ required: true, message: '必填' }]}
                          >
                            <div
                              className={sc(
                                'container-tab-set-menu-content-right-form-content-header',
                              )}
                            >
                              {contentTypeList?.map((item: any, index: any) => {
                                return (
                                  <div
                                    className={`${sc(
                                      'container-tab-set-menu-content-right-form-content-header-item',
                                    )} ${contentType === item.label ? 'active' : ''}`}
                                    key={index}
                                    onClick={() => {
                                      handleContentType(item.label);
                                    }}
                                  >
                                    {item.name}
                                  </div>
                                );
                              })}
                            </div>
                          </Form.Item>
                          {contentType === 'TEXT' && (
                            <Form.Item
                              label="展示内容"
                              name="content"
                              rules={[{ required: true, message: '必填' }]}
                            >
                              <Input.TextArea
                                placeholder="请输入"
                                autoSize={{ minRows: 3, maxRows: 5 }}
                                maxLength={300}
                              />
                            </Form.Item>
                          )}
                          {contentType === 'LINK' && (
                            <Form.Item
                              label="展示内容"
                              name="content"
                              rules={[{ required: true, message: '必填' }]}
                            >
                              <Input placeholder="请输入" />
                            </Form.Item>
                          )}
                          {contentType === 'PICTURE' && (
                            <Form.Item
                              label="展示内容"
                              name="content"
                              rules={[{ required: true, message: '必填' }]}
                            >
                              <UploadForm
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                accept=".png,.jpeg,.jpg"
                                tooltip={
                                  <span className={'tooltip'}>图片格式仅支持JPG、PNG、JPEG</span>
                                }
                                setValue={(e) => coverOnChange(e)}
                                onChange={(value: any) => {
                                  contentTypeOnChange(value);
                                }}
                              />
                            </Form.Item>
                          )}
                        </React.Fragment>
                      }
                      <Form.Item
                        label="权重"
                        name="weight"
                        rules={[{ required: true, message: '必填' }]}
                      >
                        <InputNumber
                          placeholder="请输入"
                          step={1}
                          min={1}
                          max={99999999}
                          precision={0}
                        />
                      </Form.Item>
                    </Form>
                  )}
                  <div>
                    <Popconfirm
                      title={
                        <div>
                          <div>删除</div>
                          <div>确认删除?</div>
                        </div>
                      }
                      onConfirm={handleMenuChildItemDelete}
                      okText="删除"
                      cancelText="取消"
                    >
                      <Button>删除</Button>
                    </Popconfirm>
                    <Button
                      style={{
                        marginLeft: '20px',
                      }}
                      onClick={() => {
                        if (currentChilrden?.name === '添加菜单') {
                          let warning = false;
                          dataSoueceList.forEach((item: any) => {
                            if (item.name === childrenData.name) {
                              if (item?.childMenu.length > 6) {
                                warning = true;
                              }
                            }
                          });
                          if (warning) return message.warning('最多添加6条');
                          handleChilrdenMenuItemAdd(currentMenu);
                        } else {
                          handleMenuChildItemEdit();
                        }
                      }}
                    >
                      暂存子菜单
                    </Button>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
      <Affix offsetBottom={0}>
        <div className={sc('container-tab-set-bottom')}>
          {serveDetail?.state === 'OFF_SHELF' && (
            <React.Fragment>
              <div className={sc('container-tab-set-bottom-left')}>
                <Button type="primary" onClick={() => onSubmit(1)}>
                  立即上架
                </Button>
              </div>
              <Button onClick={() => onSubmit(2)}>暂存</Button>
            </React.Fragment>
          )}
          {serveDetail?.state !== 'OFF_SHELF' && (
            <React.Fragment>
              <Popconfirm
                title="确定更新当前服务号信息"
                okText="确定"
                cancelText="取消"
                onConfirm={() => onSubmit(1)}
              >
                <Button type="primary">更新服务号</Button>
              </Popconfirm>
            </React.Fragment>
          )}
          {/* 未上架和上架的返回，要有不同的方法 */}
          <div
            style={{
              marginLeft: '20px',
            }}
          >
            <Button onClick={() => {
              if (infoFormChange) {
                if (serveDetail?.state !== 'OFF_SHELF') {
                  // 已上架
                  // history.goBack()
                  setVisibleTwo(true)
                } else {
                  // 未上架, 有暂存
                  setVisible(true)
                }
              } else {
                history.goBack()
              }
            }}>返回</Button>
          </div>
        </div>
      </Affix>
      <Modal
        width={330}
        visible={visible}
        title="提示"
        onCancel={() => {
          setVisible(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisible(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              history.goBack()
            }}
          >
            直接离开
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              onSubmit(2)
              history.goBack()
            }}
          >
            暂存并离开
          </Button>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
      <Modal
        width={350}
        visible={visibleTwo}
        title="提示"
        onCancel={() => {
          setVisibleTwo(false);
        }}
        footer={[
          <Button key="back" onClick={() => setVisibleTwo(false)}>
            取消
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              history.goBack()
            }}
          >
            直接离开
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => {
              onSubmit(1)
              history.goBack()
            }}
          >
            更新服务号并离开
          </Button>,
        ]}
      >
        <p>数据未保存，是否仍要离开当前页面？</p>
      </Modal>
    </div>
  );

  return (
    <PageContainer
      className={sc('container')}
      header={{
        title: activeTab,
        breadcrumb: (
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link to="/baseline/baseline-service-number">服务号管理</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{activeTab}</Breadcrumb.Item>
          </Breadcrumb>
        ),
      }}
    >
      <div className={sc('container-tab')}>
        <Tabs
          defaultActiveKey="草稿箱"
          activeKey={activeTab}
          // activeKey={'服务号设置'}
          onChange={(e: string) => setActiveTab(e as AuditType)}
        >
          <Tabs.TabPane tab="草稿箱" key="草稿箱">
            <Spin spinning={drafLoading}>
              <div className={sc('container-tab-drafts')}>
                {draftsList &&
                  draftsList?.map((item: any, index: any) => {
                    return (
                      <React.Fragment key={index}>
                        <DraftsItem dataSource={item} id={id} />
                      </React.Fragment>
                    );
                  })}
              </div>
            </Spin>
          </Tabs.TabPane>
          <Tabs.TabPane tab="发布记录" key="发布记录">
            {/* 发布记录 */}
            {ReleaseRecord}
          </Tabs.TabPane>
          <Tabs.TabPane tab="服务号设置" key="服务号设置">
            {/* 服务号设置 */}
            {SetService}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </PageContainer>
  );
};
