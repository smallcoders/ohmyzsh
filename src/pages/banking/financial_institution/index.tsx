/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/no-array-index-key */
import { PageContainer } from '@ant-design/pro-layout';
import { PlusOutlined, MoreOutlined, MenuOutlined } from '@ant-design/icons';
import {
  Button,
  Empty,
  Modal,
  Form,
  Input,
  Select,
  Col,
  Row,
  Tree,
  Radio,
  Popover,
  message as antdMessage,
  message,
  Popconfirm,
  Drawer,
  Space,
  Table,
} from 'antd';
import { getFileInfo } from '@/services/common';
import {
  getBankTree,
  getBankInfo,
  getQueryBank2,
  saveOrUpdateInstitution,
  removeBank,
  queryCooperateOrg,
} from '@/services/financial-institution';
// import type { DirectoryTreeProps } from 'antd/es/tree';
import type FinancialInstitution from '@/types/financial-institution';
import scopedClasses from '@/utils/scopedClasses';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './index.less';
import UploadForm from '@/components/upload_form';
import circle from '@/assets/financial/circle.png';
import empty from '@/assets/financial/empty.png';
import FormEdit from '@/components/FormEdit';
const sc = scopedClasses('financial-institution');
const { DirectoryTree, TreeNode } = Tree;
import type { ColumnsType } from 'antd/es/table';
import update from 'immutability-helper';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default () => {
  const [form] = Form.useForm();
  const [modalForm] = Form.useForm();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [modalFormInfo, setModalFormInfo] = useState<FinancialInstitution.ModalFormInfo>({});
  const [isContent, setContent] = useState(true);
  const [isRadio, setIsRadio] = useState(1);
  const [detailInfo, setDetailInfo] = useState<any>({});
  const [bankUserInfoList, setBankUserInfoList] = useState<FinancialInstitution.bankUserInfo[]>([
    { name: '', phone: '', position: null, id: null, bankId: null },
  ]);
  const [isDetail, setDetail] = useState(false);
  const allBankInfo: any = useRef([]);
  const allBankOptions: any = useRef([]);
  const modalFieldsValue: any = useRef({});
  const [changeSelectObj, setChangeSelectObj] = useState<any>({});
  const [disabledFlag, setDisabledFlag] = useState(false);
  const [isBank2Show, setBank2Show] = useState(false);
  const [isAdd3Info, setIsAdd3Info] = useState({});
  const [bankData, setBankData] = useState<FinancialInstitution.BankTreeData>({
    name: '',
    id: 1,
    bank: [],
  });
  const positionOptions = [
    { label: '总经理', value: 1 },
    { label: '部门主管', value: 2 },
    { label: '客户经理', value: 3 },
  ];
  const [sort, setSort] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [cooperateOrgList, setCooperateOrgList] = useState<FinancialInstitution.cooperateOrg[]>([]);
  const [firstPage, setFirstPage] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectTree, setSelectTree] = useState<string>();
  // 图片
  const logoImgFn = async (id: number) => {
    const { result, code } = await getFileInfo(String(id));
    if (code === 0) {
      return result[0].path;
    }
  };
  // 一级二级机构
  const getQueryBank2List = async () => {
    const { code, result } = await getQueryBank2();
    if (code === 0) {
      allBankInfo.current = result;
      result.map((item: { name: any; id: any }) => {
        allBankOptions.current.push({
          label: item.name,
          value: item.id,
        });
      });
    }
  };
  const getTree = async () => {
    try {
      const { code, result } = await getBankTree();
      if (code === 0) {
        if (result === null) {
          setContent(false);
        } else {
          setBankData(result);
        }
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 合作机构
  const getCooperateOrg = async (status: string = 'edit') => {
    try {
      const { code, result } = await queryCooperateOrg();
      if (code === 0) {
        if (status === 'add') {
          setSort(result[result.length - 1].sort + 1);
          setCooperateOrgList([
            ...result,
            { name: modalFieldsValue.current.name, sort: result[result.length - 1].sort + 1 },
          ]);
        } else {
          setCooperateOrgList([...result]);
        }
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // 详情
  const detailBankInfo = async (id: number, isAdd3 = 'no', node?: number) => {
    setDisabledFlag(false);
    try {
      const { code, result } = await getBankInfo(id);
      if (code === 0) {
        // 三级新增
        if (isAdd3 === 'yes' && node === 1) {
          setIsAdd3Info({ ...result });
          const { nature, officialLogoImage, productLogoImage, bankNature } = result;
          form.setFieldsValue({
            nature,
            officialLogoImage,
            productLogoImage,
            bankNature: nature === 1 ? bankNature : null,
          });
          setDisabledFlag(true);
          // 三级编辑
        } else if (isAdd3 === 'yes' && node === 2) {
          setIsAdd3Info({ ...result });
          const { nature, officialLogoImage, productLogoImage, bankNature } = result;
          form.setFieldsValue({
            nature,
            officialLogoImage,
            productLogoImage,
            bankNature: nature === 1 ? bankNature : null,
          });
          setDisabledFlag(true);
        } else {
          setDetailInfo({ ...result });
          form.setFieldsValue({
            ...result,
          });
          setSort(result.sort);
          if (result.bankUserInfoList && result.bankUserInfoList?.length > 0) {
            setBankUserInfoList([...result.bankUserInfoList]);
          }
        }
        if (result.nature === 1) {
          setBank2Show(true);
        } else {
          setBank2Show(false);
        }
      }
    } catch (error) {
      antdMessage.error(`请求失败，原因:{${error}}`);
    }
  };
  // #region 右表
  // 右表
  const natureOptions1 = [
    { label: '银行', value: 1 },
    { label: '融资租赁', value: 2 },
    { label: '担保', value: 3 },
    { label: '保险', value: 4 },
  ];
  const natureOptions2 = [
    { label: '国有银行', value: 1 },
    { label: '股份制商业银行', value: 2 },
    { label: '城市商业银行', value: 3 },
    { label: '农村商业行', value: 4 },
  ];

  const changeNature1 = (value: number) => {
    if (value === 1) {
      setBank2Show(true);
    } else {
      setBank2Show(false);
      // form.setFieldValue({ bankNature: null });
    }
  };
  // 经办人
  const add = () => {
    form.setFieldsValue({
      bankUserInfoList: [
        ...bankUserInfoList,
        { name: '', phone: '', position: null, id: null, bankId: null },
      ],
    });
    return setBankUserInfoList([
      ...bankUserInfoList,
      { name: '', phone: '', position: null, id: null, bankId: null },
    ]);
  };
  const del = (index: number) => {
    form.setFieldsValue({
      bankUserInfoList: [...bankUserInfoList.slice(0, index), ...bankUserInfoList.slice(index + 1)],
    });
    return setBankUserInfoList([
      ...bankUserInfoList.slice(0, index),
      ...bankUserInfoList.slice(index + 1),
    ]);
  };
  const onChange = (index: number, data: any, event: any) => {
    const tempArray = [...bankUserInfoList];
    // eslint-disable-next-line no-param-reassign
    if (data === 'name')
      tempArray[index] = {
        ...tempArray[index],
        name: event.target.value,
        bankId: Object.values(detailInfo).length > 0 ? detailInfo.id : null,
      };
    if (data === 'phone')
      tempArray[index] = {
        ...tempArray[index],
        phone: event.target.value,
        bankId: Object.values(detailInfo).length > 0 ? detailInfo.id : null,
      };
    if (data === 'position')
      tempArray[index] = {
        ...tempArray[index],
        position: event,
        bankId: Object.values(detailInfo).length > 0 ? detailInfo.id : null,
      };
    return setBankUserInfoList(tempArray);
  };
  const bankUserInfoItem = bankUserInfoList.map((item, index: number) => {
    return (
      <>
        <Row key={index} className="agentInput">
          <Col>
            <Form.Item name={['bankUserInfoList', index, 'name']}>
              <Input
                onChange={(event) => onChange(index, 'name', event)}
                placeholder="请输入姓名"
                allowClear
                maxLength={35}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              name={['bankUserInfoList', index, 'phone']}
              rules={[
                {
                  pattern: /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/,
                  message: '请输入正确的手机号码',
                },
              ]}
            >
              <Input
                onChange={(event) => onChange(index, 'phone', event)}
                placeholder="请输入手机号"
                allowClear
                maxLength={11}
              />
            </Form.Item>
          </Col>
          <Col>
            <Form.Item name={['bankUserInfoList', index, 'position']}>
              <Select
                placeholder="请选择职位"
                options={positionOptions}
                allowClear
                onChange={(value) => onChange(index, 'position', value)}
              />
            </Form.Item>
          </Col>
          <Col>
            <img src={circle} alt="" onClick={() => del(index)} className="del" />
          </Col>
        </Row>
      </>
    );
  });
  // #endregion
  // 左树
  // 删除
  const remove = async (id: number) => {
    try {
      const removeRes = await removeBank(id);
      if (removeRes.code === 0) {
        message.success(`删除成功`);
        getTree();
      } else {
        message.error(`删除失败，原因:${removeRes.message}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getContent = (item: any) => {
    return (
      <div className="action">
        {item.node === 0 || item.node === 1 ? (
          <p
            onClick={async () => {
              // setDetail(false);
              // setIsAdd3Info({});
              // setDetailInfo({});
              // form.resetFields();
              if (item.node === 0) {
                setModalType('1');
              } else {
                setModalType('2');
              }
              await getQueryBank2List();
              // await getCooperateOrg();
              setCreateModalVisible(true);
              setModalFormInfo(item);
              if (item.node === 1) {
                modalForm.setFieldsValue({ id: item.id });
                // await detailBankInfo(item.id, '', item.node);
              }
            }}
          >
            添加子机构
          </p>
        ) : (
          <></>
        )}
        {item.node === 1 || item.node === 2 ? (
          <p
            onClick={async () => {
              if (!firstPage) {
                setFirstPage(true);
              }
              setSelectTree(String(item.id));
              setDetail(false);
              setIsAdd3Info({});
              setDetailInfo({});
              if (item.node === 2) {
                await detailBankInfo(item.id, 'no', item.node);
                await detailBankInfo(item.parentId, 'yes', item.node);
              } else {
                await detailBankInfo(item.id, 'no', item.node);
              }
            }}
          >
            编辑信息
          </p>
        ) : (
          <></>
        )}
        {item.node === 2 || (item.node === 1 && item?.banks?.length === 0) ? (
          <Popconfirm
            title="确定删除么？"
            okText="确定"
            placement="right"
            cancelText="取消"
            onConfirm={() => remove(item.id as number)}
          >
            <p className="del-action">删除</p>
          </Popconfirm>
        ) : item.node === 1 && item?.banks?.length > 0 ? (
          <Popconfirm
            showCancel={false}
            placement="right"
            title="提示  请先删除该机构下的子机构再进行删除机构操作"
            okText="好的"
          >
            <p className="del-action">删除</p>
          </Popconfirm>
        ) : (
          <></>
        )}
      </div>
    );
  };
  const getTitle = (item: any) => (
    <div className="bankTitle">
      {/* 标题 */}
      <span
        className="bankName"
        onClick={async () => {
          setIsAdd3Info({});
          setBankUserInfoList([]);
          setSelectTree(String(item.id));
          await detailBankInfo(item.id, 'no', item.node);
          setDetail(true);
          if (firstPage === false) {
            setFirstPage(true);
          }
        }}
      >
        {item.name}
      </span>
      <span>
        <Popover
          placement="rightTop"
          content={getContent(item)}
          trigger="hover"
          overlayClassName="bank-institution-popover"
        >
          <MoreOutlined />
        </Popover>
      </span>
    </div>
  );

  useEffect(() => {
    getTree();
  }, []);

  const renderTreeNodes = (bank: any) => {
    const nodeArr = bank.map((item: any) => {
      if (item.banks) {
        return (
          <TreeNode title={getTitle(item)} key={item.id}>
            {renderTreeNodes(item.banks)}
          </TreeNode>
        );
      }
      return <TreeNode title={getTitle(item)} key={item.id} />;
    });
    return nodeArr;
  };

  // 新增编辑
  const addOrUpdate = async () => {
    const values = await form.validateFields();
    const selectObj = allBankInfo.current.find(
      (item: { id: number }) => item.id === modalFieldsValue.current.id,
    );
    try {
      const {
        code,
        result,
        message: resultMsg,
      } = await (Object.values(detailInfo).length > 0
        ? // 编辑
          saveOrUpdateInstitution({
            ...values,
            id: detailInfo.id,
            parentId: detailInfo.parentId,
            node: detailInfo.node,
            sort,
            officialLogoImage:
              values.officialLogoImage.indexOf('http') === 0
                ? values.officialLogoImage
                : await logoImgFn(values.officialLogoImage),
            productLogoImage:
              values.productLogoImage.indexOf('http') === 0
                ? values.productLogoImage
                : await logoImgFn(values.productLogoImage),
            bankUserInfoList: bankUserInfoList,
          })
        : saveOrUpdateInstitution({
            ...values,
            sort,
            parentId:
              Object.keys(modalFormInfo).length == 0
                ? modalFieldsValue.current.id
                : modalFormInfo.id,
            node:
              Object.keys(modalFormInfo).length == 0 ? selectObj.node + 1 : modalFormInfo.node + 1,
            bankUserInfoList: bankUserInfoList,
            officialLogoImage:
              values.officialLogoImage.indexOf('http') === 0
                ? values.officialLogoImage
                : await logoImgFn(values.officialLogoImage),
            productLogoImage:
              values.productLogoImage.indexOf('http') === 0
                ? values.productLogoImage
                : await logoImgFn(values.productLogoImage),
          }));
      if (code === 0) {
        message.success(Object.values(detailInfo).length > 0 ? '编辑成功' : '新增成功');
        detailBankInfo(result as number, 'no');
        setSelectTree(String(result));
        setModalFormInfo({});
        getTree();
        setDetail(true);
      } else {
        message.error(
          Object.values(detailInfo).length > 0 ? '编辑失败' : '新增失败, 原因:' + resultMsg,
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onClose = () => {
    allBankOptions.current = [];
    setChangeSelectObj({});
    modalForm.resetFields();
    setCreateModalVisible(false);
  };

  // 新增机构弹框
  // 选择机构
  const useModal = (): React.ReactNode => {
    return (
      <Modal
        title="新增机构"
        width="600px"
        visible={createModalVisible}
        maskClosable={false}
        destroyOnClose
        onOk={async () => {
          const values = await modalForm.validateFields();
          if (isContent === false) {
            const { code } = await saveOrUpdateInstitution({
              ...values,
              node: 0,
            });
            if (code === 0) {
              message.success('新增成功');
              getTree();
              setContent(true);
              setCreateModalVisible(false);
              modalForm.resetFields();
            }
          } else {
            setIsAdd3Info({});
            setDetailInfo({});
            setBankUserInfoList([]);
            form.resetFields();
            setSort(null);
            setDetail(false);
            if (firstPage === false) {
              setFirstPage(true);
            }
            if (modalFormInfo.node === 1 && modalType === '2') {
              await detailBankInfo(modalFormInfo.id, 'yes', modalFormInfo.node);
            }
            if (modalType === '3') {
              if (Object.keys(changeSelectObj).length !== 0) {
                setSelectTree(String(changeSelectObj.value));
              } else {
                const nodeObj = allBankInfo.current.find((item: any) => item.node === 0);
                setSelectTree(String(nodeObj.id));
              }
            }
            // if (Object.keys(changeSelectObj.current).length !== 0 && ) {
            //   setSelectTree(String(changeSelectObj.current.value));
            //   await detailBankInfo(changeSelectObj.current.value, 'yes', 1);
            // }
            if (modalType === '1' || modalType === '2') {
              setSelectTree(String(modalFormInfo.id));
            }
            modalFieldsValue.current = modalForm.getFieldsValue();
            await getCooperateOrg('add');
            form.setFieldsValue({ name: values.name });
            onClose();
          }
        }}
        onCancel={() => {
          onClose();
        }}
      >
        <Form
          form={modalForm}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="name"
            label="机构名称"
            rules={[
              {
                required: true,
                message: '请输入机构名称',
              },
            ]}
          >
            <Input placeholder="请输入" maxLength={35} />
          </Form.Item>
          {modalType === '3' && isContent ? (
            <Form.Item
              name="id"
              label="上级机构"
              rules={[
                {
                  required: true,
                  message: '请选择上级机构',
                },
              ]}
            >
              {/* <Select
                style={{ width: 368 }}
                allowClear
                options={allBankOptions.current}
                onChange={(value) => {
                  changeSelect.current = value;
                }}
              /> */}
              <Select
                style={{ width: '100%' }}
                onChange={(value, option) => {
                  setChangeSelectObj({ ...option });
                }}
              >
                {allBankInfo.current.map((item: any) => {
                  return (
                    <Select.Option key={item.id} node={item.node} value={item.id}>
                      {item.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          ) : modalType === '2' && isContent ? (
            <Form.Item
              name="id"
              label="上级机构"
              rules={[
                {
                  required: true,
                  message: '请选择上级机构',
                },
              ]}
            >
              <Select style={{ width: 368 }} allowClear options={allBankOptions.current} disabled />
            </Form.Item>
          ) : (
            <></>
          )}
        </Form>
      </Modal>
    );
  };
  //拖拽排序
  interface DataType {
    name?: string;
    sort?: number;
    index?: number;
  }
  interface DraggableBodyRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
    index: number;
    moveRow: (dragIndex: number, hoverIndex: number) => void;
  }
  const type = 'DraggableBodyRow';
  const DraggableBodyRow = ({
    index,
    moveRow,
    className,
    style,
    ...restProps
  }: DraggableBodyRowProps) => {
    const ref = useRef<HTMLTableRowElement>(null);
    const [{ isOver, dropClassName }, drop] = useDrop({
      accept: type,
      collect: (monitor) => {
        const { index: dragIndex } = monitor.getItem() || {};
        if (dragIndex === index) {
          return {};
        }
        return {
          isOver: monitor.isOver(),
          dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
        };
      },
      drop: (item: { index: number }) => {
        moveRow(item.index, index);
      },
    });
    const [, drag] = useDrag({
      type,
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    drop(drag(ref));

    return (
      <tr
        ref={ref}
        className={`${className}${isOver ? dropClassName : ''}`}
        style={{ cursor: 'move', ...style }}
        {...restProps}
      />
    );
  };

  const columns: ColumnsType<DataType> = [
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      width: 30,
      align: 'center',
      className: 'drag-visible',
      render: () => <MenuOutlined />,
    },
    {
      title: '顺序排列',
      dataIndex: 'index',
      key: 'index',
      align: 'center',
      className: 'drag-visible',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
  ];

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = cooperateOrgList[dragIndex];
      console.log(dragIndex, 'dragIndex');
      console.log(hoverIndex, 'hoverIndex');
      console.log(dragRow, 'dragRow');
      setCooperateOrgList(
        update(cooperateOrgList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [cooperateOrgList],
  );
  // 排序抽屉
  const onCancel = () => {
    // setCooperateOrgList([]);
    setDrawerVisible(false);
  };
  const useDrawer = (): React.ReactNode => {
    return (
      <Drawer
        title="机构展示顺序"
        width="720px"
        placement="right"
        onClose={onCancel}
        visible={drawerVisible}
        footer={
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button
              type="primary"
              onClick={() => {
                if (Object.values(detailInfo).length === 0) {
                  setSort(
                    cooperateOrgList.findIndex(
                      (item) => item.name === modalFieldsValue.current.name,
                    ) + 1,
                  );
                } else {
                  setSort(cooperateOrgList.findIndex((item) => item.name === detailInfo.name) + 1);
                }
                setDrawerVisible(false);
              }}
            >
              确定
            </Button>
          </Space>
        }
        footerStyle={{ display: 'flex', justifyContent: 'end' }}
      >
        <DndProvider backend={HTML5Backend}>
          <Table
            columns={columns}
            dataSource={cooperateOrgList}
            components={components}
            rowKey="sort"
            onRow={(_, index) => {
              const attr = {
                index,
                moveRow,
              };
              return attr as React.HTMLAttributes<any>;
            }}
            pagination={false}
          />
        </DndProvider>
      </Drawer>
    );
  };
  return (
    <PageContainer
      className={isDetail || !firstPage || !isContent ? sc('page2') : sc('page1')}
      ghost
      header={{
        title: '金融机构管理',
        breadcrumb: {},
      }}
      footer={[
        <>
          <Button
            onClick={async () => {
              await detailBankInfo(Number(selectTree), 'no');
              setDetail(true);
            }}
          >
            取消
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => {
              addOrUpdate();
            }}
          >
            保存
          </Button>
        </>,
      ]}
    >
      {isContent ? (
        <div className={sc('container')}>
          <Row>
            <Col span={6} className={sc('container-left')}>
              <DirectoryTree
                expandAction={false}
                // onSelect={onSelect}
                key="id"
                icon={() => null}
                defaultExpandAll
                // height={800}
                multiple
                selectedKeys={[selectTree]}
                // defaultSelectedKeys={["11"]}
              >
                <TreeNode selectable title={getTitle(bankData)} key={bankData.id}>
                  {renderTreeNodes(bankData.bank)}
                </TreeNode>
              </DirectoryTree>
              <Button
                className="add"
                size="large"
                onClick={async () => {
                  // setDetail(false);
                  // setIsAdd3Info({});
                  // setDetailInfo({});
                  // form.resetFields();
                  setModalType('3');
                  await getQueryBank2List();
                  // await getCooperateOrg();
                  setCreateModalVisible(true);
                  modalForm.setFieldsValue({ id: allBankInfo.current[0].id });
                  // if (allBankInfo.current.length > 0) {
                  //   const grade1 = allBankInfo.current.find(
                  //     (item: { node: number }) => item.node === 0,
                  //   );
                  //   modalForm.setFieldsValue({ id: grade1.id });
                  // }
                }}
              >
                <PlusOutlined />
                新增机构
              </Button>
            </Col>

            {firstPage === false ? (
              <></>
            ) : (
              <Col span={18} className={sc('container-right')}>
                <div className="title">
                  <span>基本信息</span>
                  {isDetail ? (
                    <Button
                      type="primary"
                      onClick={async () => {
                        if (detailInfo.node === 2) {
                          setDisabledFlag(true);
                          await detailBankInfo(detailInfo.id, 'no', detailInfo.node);
                          await detailBankInfo(detailInfo.parentId, 'yes', detailInfo.node);
                        } else {
                          await detailBankInfo(detailInfo.id, 'no', detailInfo.node);
                        }
                        setDetail(false);
                      }}
                    >
                      编辑
                    </Button>
                  ) : (
                    <></>
                  )}
                </div>
                {isDetail ? (
                  <div className="detail-form">
                    <div className="item">
                      <label>机构名称 :</label>
                      {detailInfo.name}
                    </div>
                    <div className="item">
                      <label>机构编码 :</label>
                      {detailInfo.code}
                    </div>
                    <div className="item">
                      <label>机构性质 :</label>
                      {detailInfo.nature === 1
                        ? natureOptions1.find((item) => item.value === detailInfo.nature)?.label +
                          '-' +
                          natureOptions2.find((item) => item.value === detailInfo.bankNature)?.label
                        : natureOptions1.find((item) => item.value === detailInfo.nature)?.label}
                    </div>
                    {detailInfo.node === 2 ? (
                      <></>
                    ) : (
                      <div className="item">
                        <label>是否为合作机构 :</label>
                        {detailInfo.isCoopera === 1 ? '是' : '否'}
                      </div>
                    )}
                    {detailInfo.node === 2 ? (
                      <></>
                    ) : (
                      <div className="item">
                        <label>机构展示顺序 :</label>
                        {detailInfo.sort}
                      </div>
                    )}
                    <div className="item">
                      <label>机构logo :</label>
                      <img
                        style={{ width: 80, marginRight: 48 }}
                        src={detailInfo?.officialLogoImage}
                        alt=""
                      />
                      <img style={{ width: 80 }} src={detailInfo?.productLogoImage} alt="" />
                    </div>
                    <div className="item">
                      <label>经办人 :</label>
                      <div>
                        {detailInfo.bankUserInfoList && detailInfo.bankUserInfoList.length === 0 ? (
                          <>--</>
                        ) : (
                          detailInfo?.bankUserInfoList?.map((item: any, k: any) => {
                            return (
                              <p key={k} style={{ marginBottom: 0 }}>
                                {item.name} {item.phone}{' '}
                                {item.position === 1
                                  ? '总经理'
                                  : item.position === 2
                                  ? '部门主管'
                                  : item.position === 3
                                  ? '客户经理'
                                  : '--'}
                              </p>
                            );
                          })
                        )}
                      </div>
                    </div>
                    <div className="item">
                      <label>机构介绍 :</label>
                      <div dangerouslySetInnerHTML={{ __html: detailInfo?.content }} />
                    </div>
                  </div>
                ) : (
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 4 }}
                    validateTrigger={['onBlur']}
                  >
                    <Form.Item
                      label="机构名称"
                      name="name"
                      rules={[{ required: true, message: '请输入机构名称' }]}
                    >
                      <Input maxLength={35} allowClear />
                    </Form.Item>
                    <Form.Item
                      label="机构编码"
                      name="code"
                      rules={[{ required: true, message: '请输入机构编码' }]}
                    >
                      <Input maxLength={35} placeholder="请输入" allowClear />
                    </Form.Item>

                    <Form.Item label="机构性质" required>
                      <Form.Item
                        name="nature"
                        rules={[{ required: true, message: '请选择机构性质' }]}
                        style={{ display: 'inline-block', marginRight: 12, marginBottom: 0 }}
                      >
                        <Select
                          disabled={disabledFlag}
                          onChange={changeNature1}
                          options={natureOptions1}
                          placeholder="请选择"
                        />
                      </Form.Item>
                      {isBank2Show ? (
                        <Form.Item
                          name="bankNature"
                          rules={[{ required: true, message: '请选择机构性质' }]}
                          style={{ display: 'inline-block', marginBottom: 0 }}
                        >
                          <Select
                            disabled={disabledFlag}
                            options={natureOptions2}
                            placeholder="请选择"
                          />
                        </Form.Item>
                      ) : (
                        <></>
                      )}
                    </Form.Item>
                    {Object.values(isAdd3Info).length > 0 || detailInfo.node === 2 ? (
                      <></>
                    ) : (
                      <Form.Item
                        label="是否为合作机构"
                        name="isCoopera"
                        initialValue={1}
                        rules={[{ required: true, message: '请选择机构性质' }]}
                      >
                        <Radio.Group
                          value={isRadio}
                          onChange={(e) => {
                            setIsRadio(e.target.value);
                          }}
                        >
                          <Radio value={1}>是</Radio>
                          <Radio value={0}>否</Radio>
                        </Radio.Group>
                      </Form.Item>
                    )}

                    {isRadio === 0 ||
                    Object.values(isAdd3Info).length > 0 ||
                    detailInfo.node === 2 ? (
                      <></>
                    ) : (
                      <Form.Item label="机构展示顺序" name="sort" required>
                        <div className="changeNum">
                          <span>{sort}</span>
                          {sort !== null ? (
                            <span
                              className="changeOrder"
                              onClick={() => {
                                if (cooperateOrgList.length === 0) {
                                  getCooperateOrg();
                                }
                                console.log(cooperateOrgList);
                                setDrawerVisible(true);
                              }}
                            >
                              修改顺序
                            </span>
                          ) : (
                            <></>
                          )}
                        </div>
                      </Form.Item>
                    )}
                    <Form.Item label="机构logo" required>
                      {isRadio === 0 ? (
                        <></>
                      ) : (
                        <Form.Item
                          name="officialLogoImage"
                          extra="请上传448*160图片"
                          rules={[{ required: true, message: '请上传logo' }]}
                          style={{ display: 'inline-block', width: 140 }}
                        >
                          <UploadForm
                            disabled={disabledFlag}
                            listType="picture-card"
                            showUploadList={false}
                            accept=".png,.jpeg,.jpg"
                            maxCount={1}
                          />
                        </Form.Item>
                      )}
                      <Form.Item
                        name="productLogoImage"
                        extra="请上传132*132图片"
                        rules={[{ required: true, message: '请上传logo' }]}
                        style={{ display: 'inline-block' }}
                      >
                        <UploadForm
                          disabled={disabledFlag}
                          listType="picture-card"
                          showUploadList={false}
                          accept=".png,.jpeg,.jpg"
                          maxCount={1}
                        />
                      </Form.Item>
                    </Form.Item>

                    <Form.Item label="经办人">
                      {bankUserInfoItem}
                      <Button onClick={add} className="add">
                        + 添加
                      </Button>
                    </Form.Item>
                    <Form.Item name="content" label="机构介绍">
                      <FormEdit width={624} />
                    </Form.Item>
                  </Form>
                )}
              </Col>
            )}
          </Row>
        </div>
      ) : (
        <div className={sc('container')}>
          <div className={sc('container-initial')}>
            <div className="title">
              <span>金融机构管理</span>
            </div>
            <div className="content">
              <Empty
                image={empty}
                imageStyle={{
                  height: 160,
                }}
                description={<span>暂无内容，点击进行金融大客户条件设置</span>}
              />
              <Button
                className="goAdd"
                type="primary"
                onClick={() => {
                  setCreateModalVisible(true);
                }}
              >
                立即添加
              </Button>
            </div>
          </div>
        </div>
      )}
      {useModal()}
      {useDrawer()}
    </PageContainer>
  );
};
