import {
  Form,
  Button,
  Modal,
  message,
  Checkbox,
  Input,
  DatePicker,
} from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import scopedClasses from '@/utils/scopedClasses';
import moment from 'moment';
import dayjs from 'dayjs';
import Common from '@/types/common.d'
// import type Common from '@/types/common';
import SearchBar from '@/components/search_bar'
import SelfTable from '@/components/self_table';
import { history, Access, useAccess } from 'umi';
import './index.less'
import { useState, useMemo, useEffect } from 'react';
import { getVersionAdd, getVersionDelete, getVersionPage } from '@/services/version-updating';

const sc = scopedClasses('baseline-version-updating');


const systemCheckBox = [
 { label: 'IOS', value: 'IOS' },
 { label: 'Android', value: 'Android' },
]
export default(() => {
  const access = useAccess()
  const { TextArea } = Input;
  const [formSearch] = Form.useForm()
  const [formAdd] = Form.useForm()
  const [titleMotal, setTitleMotal] = useState<string>('新建')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<any>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [searchContent, setSearChContent] = useState<any>({});
  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    setLoading(true)
    try {
      // const { result, code, message } = {
      //   code: 0,
      //   message: 0,
      //   result: {
      //     total: 1,
      //   }
      // };
      const { result, code, message } = await getVersionPage({
        pageIndex,
        pageSize,
        ...searchContent,
      });
      setLoading(false)
      if (code === 0) {
        setPageInfo({ totalCount: result.total, pageTotal: Math.ceil(result.total / pageSize), pageIndex, pageSize });
        setDataSource(result || []);
        // setDataSource([
        //   {
        //     id: 1,
        //     date: 1675750971000,
        //     system: ['Android', 'IOS '],
        //     version: '2.0.1',
        //     content: '关于***********************BUG修复',
        //     operator: '王也',
        //     updateTime: '2023-05-08'
        //   },
        //   {
        //     id: 2,
        //     date: 1675750971000,
        //     system: ['Android'],
        //     version: '2.0.1',
        //     content: '关于***********************BUG修复',
        //     operator: '诸葛青',
        //     updateTime: '2023-05-09'
        //   },
        // ]);
      } else {
        throw new Error(message);
      }
    } catch (error) {
      setLoading(false)
      message.error(`请求失败，原因:{${error}}`);
    }
  };

  useEffect(() => {
    getPage()
  },[searchContent])

  // 新增/编辑的id
  const [editId, setEditId] = useState<number | null>();
  const clearForm = () => {
    formAdd.resetFields();
    setEditId(null);
    setModalOpen(false)
  }
  const handleModalOk = async () => {
    await formAdd.validateFields();
    const {system, version, date, content } = formAdd.getFieldsValue();
    console.log('搜集的表单', formAdd.getFieldsValue())
    try {
      const res = await getVersionAdd({
        system: system ? system?.join(',') : undefined,
        version,
        date: date ? moment(date).format('YYYY-MM-DD') : undefined,
        content,
        id: editId ? editId : undefined
      })
      if (res?.code === 0) {
        // 重新获取页面
        // getPage()
        message.success(`${titleMotal}完成`)
        clearForm()
      } else {
        message.error(`${titleMotal}失败, 原因:${res?.message}`)
      }
    } catch (error) {
      message.error(`${titleMotal}失败, 原因:${error}`)
    }
  }
  const handleModalCancel = () => {
    clearForm()
  }

  const searchList = useMemo(() => {
    return [
      {
        key: 'version',
        label: '版本号',
        type: Common.SearchItemControlEnum.INPUT,
        initialValue: '',
        allowClear: true,
      },
      {
        key: 'system',
        selectModeType: 'multiple',
        label: '操作系统',
        type: Common.SearchItemControlEnum.SELECT,
        options: [
          {
            id: 'IOS',
            name: '苹果'
          },
          {
            id: 'Android',
            name: '安卓'
          }
        ],
        allowClear: true,
      },
      {
        key: 'date',
        label: '上线日期',
        type: Common.SearchItemControlEnum.RANGE_PICKER,
        allowClear: true,
      },
    ]
  },[])

  const onSearch = (info: any) => {
    // 所有key的值需要根据接口调整
    console.log('info', info)
    const { version, system, date, ...rest } = info || {}
    setPageInfo({ ...pageInfo, pageIndex: 1 })
    setSearChContent({
      version: version ? version : undefined, 
      system: system ? system?.join(',') : undefined,
      // 时间这块可能要加上时分秒
      startDate: date ? moment(date[0]).startOf('days').format('YYYY-MM-DD') : undefined,
      endDate: date ? moment(date[1]).endOf('days').format('YYYY-MM-DD') : undefined,
    })
  }
  
  const motal = (
    <Modal
      width='500px'
      title={titleMotal}
      visible={modalOpen}
      onOk={handleModalOk} 
      onCancel={handleModalCancel}
    >
      <Form
        form={formAdd} 
        labelCol={{ span: 7 }} 
        wrapperCol={{ span: 16 }} 
        validateTrigger={['onBlur']}
      >
        <Form.Item
          name="system"
          label="操作系统"
          rules={[{ required: true, message: '必填' }]}
        >
          <Checkbox.Group 
            options={systemCheckBox}
          ></Checkbox.Group>
        </Form.Item>
        <Form.Item
          name="version"
          label="版本号"
          rules={[{ required: true, message: '必填' }]}
        >
          <Input maxLength={20} />
        </Form.Item>
        <Form.Item
          name="date"
          label="上线日期"
          rules={[{ required: true, message: '必填' }]}
        >
          <DatePicker 
            disabledDate={(current) =>
              current && current < moment().subtract(1, 'day')
            }
          />
        </Form.Item>
        <Form.Item
          name="content"
          label="版本更新内容"
          rules={[{ required: true, message: '必填' }]}
        >
          <TextArea rows={3} maxLength={100} />
        </Form.Item>
      </Form>
    </Modal>
  )
  const handleAddList = () => {
    setTitleMotal('新增')
    setModalOpen(true)
  }
  const handleEdit = (value: any) => {
    setTitleMotal('编辑')
    console.log('编辑', value)
    formAdd.setFieldsValue({
      system: value?.system || '',
      version: value?.version || '',
      date: value?.date && moment(value?.date),
      content: value?.content || '',
    })
    setModalOpen(true)
    // 赋值
  }

  const handleDelete = async (deleteId: any) => {
    try {
      const res = await getVersionDelete(deleteId)
      if (res?.code === 0) {
        message.success('删除成功')
        // 重新获取页面
        // getPage()
      } else {
        message.error(`删除失败, 原因：${res?.message}`)
      }
    } catch (error) {
      message.error(`删除失败, 原因：${error}`)
    }
  }
  // table
  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      align: 'center',
      width: 80,
      render: (_: any, _record: any, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '上线日期',
      dataIndex: 'date',
      align: 'center',
      width: 150,
      render: (date: string) => {
        return <span>{moment(date).format('YYYY-MM-DD') || '--'}</span>
      }
    },
    {
      title: '操作系统',
      dataIndex: 'system',
      align: 'center',
      width: 150,
      render: (system: string[]) => {
        return <span className={sc('container-table-system')}>{system ? system : '--'}</span>
      }
    },
    {
      title: '版本号',
      dataIndex: 'version',
      align: 'center',
      width: 100,
      render: (version: string) => {
        return (
          <span>{version || '--'}</span>
        )
      },
    },
    {
      title: '版本更新内容',
      dataIndex: 'content',
      align: 'center',
      width: 100,
      render: (content: string) => {
        return (
          <div className={sc('container-table-content')}>{content || '--'}</div>
        )
      },
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      align: 'center',
      width: 100,
      render: (operator: string) => {
        return (
          <span>{operator || '--'}</span>
        )
      },
    },
    {
      title: '最新操作时间',
      dataIndex: 'updateTime',
      align: 'center',
      width: 200,
      render: (updateTime: string) => {
        return (
          <>
            {updateTime ? moment(updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}
          </>
        )
      },
    },
    {
      title: '操作',
      hideInSearch: true,
      width: 200,
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <>
            <Access accessible={access['PU_BLM_BBGXGL']}>
              {
                <Button
                  size="small"
                  type="link"
                  onClick={handleEdit.bind(null, _)}
                >
                  编辑
                </Button>
              }
            </Access>
            <Access accessible={access['PD_BLM_BBGXGL']}>
              {
                <Button
                  size="small"
                  type="link"
                  onClick={() => {
                    handleDelete(record?.id)
                  }}
                >
                  删除
                </Button>
              }
            </Access>
          </>
        )
      },
    },
  ];
  return (
    <PageContainer className={sc('container')}>
      <div className={sc('container-searchInfo')}>
        <SearchBar form={formSearch} searchList={searchList} onSearch={onSearch} />
      </div>
      <div className={sc('container-table-header')}>
        <div className={sc('container-table-header-title')}>
          <Access accessible={access['PA_BLM_BBGXGL']}>
            <Button 
              type="primary"
              onClick={() => handleAddList()}
            >+新建</Button>
          </Access>
        </div>
      </div>
      <div className={sc('container-table-body')}>
        <SelfTable
          rowKey="id"
          bordered
          columns={columns}
          loading={loading}
          dataSource={dataSource}
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
      {motal}
    </PageContainer>
  )
})
