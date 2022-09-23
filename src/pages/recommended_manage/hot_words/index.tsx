import { Button, Input, Form, Row, Col, message as antdMessage } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';

import scopedClasses from '@/utils/scopedClasses';
import React, { useEffect, useState } from 'react';

import type Common from '@/types/common';
import type HotWords from '@/types/hot-words';

import SelfTable from '@/components/self_table';
import './index.less';
import { getBankingServicePage } from '@/services/hot-words';
const WordCloud = require('wordcloud');
const sc = scopedClasses('recommended-hot-words');
import bg from '@/assets/demand_market/1.png';
export default () => {
  const [dataSource, setDataSource] = useState<HotWords.Content[]>([]);
  const [searchContent, setSearChContent] = useState<HotWords.SearchContent>({});

  const [searchForm] = Form.useForm();
  const formLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };

  const [pageInfo, setPageInfo] = useState<Common.ResultPage>({
    pageIndex: 1,
    pageSize: 10,
    totalCount: 0,
    pageTotal: 0,
  });

  const getPage = async (pageIndex: number = 1, pageSize = pageInfo.pageSize) => {
    try {
      const { result, totalCount, pageTotal, code, message } = await getBankingServicePage({
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

  const columns = [
    {
      title: '序号',
      dataIndex: 'sort',
      width: 80,
      render: (_: any, _record: HotWords.Content, index: number) =>
        pageInfo.pageSize * (pageInfo.pageIndex - 1) + index + 1,
    },
    {
      title: '词汇',
      dataIndex: 'name',
      width: 200,
    },

    {
      title: '出现次数',
      dataIndex: 'termContent',
      isEllipsis: true,
      width: 200,
    },
  ];

  const getSearchQuery = (): {
    orgName?: string;
    productId?: number;
    verityStatus?: number;
    dateStart?: string;
    dateEnd?: string;
  } => {
    const search = searchForm.getFieldsValue();

    return search;
  };
  const initHotWordsCloud = () => {
    const wordFreqData = [
      ['各位观众', 45],
      ['反垄断', 21],
      ['加油站', 11],
      ['退票男', 31],
      ['来啦!!!', 13],
    ];
    const canvas = document.getElementById('canvas');
    const options = {
      list: wordFreqData,
      gridSize: 6, // 密集程度 数字越小越密集
      weightFactor: 1, // 字体大小=原始大小*weightFactor
      maxFontSize: 60, //最大字号
      minFontSize: 14, //最小字号
      fontWeight: 'normal', //字体粗细
      fontFamily: 'Times, serif', // 字体
      color: '#77D2F8', //'random-light', // 字体颜色 'random-dark' 或者 'random-light'
      backgroundColor: '#254E88', //'transparent', // 背景颜色
      rotateRatio: 0, // 字体倾斜(旋转)概率，1代表总是倾斜(旋转)
    };
    //生成
    WordCloud(canvas, options);
  };
  useEffect(() => {
    getPage();
    initHotWordsCloud();
  }, [searchContent]);

  const useSearchNode = (): React.ReactNode => {
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="orgName" noStyle>
                <Input placeholder="请输入词汇" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item noStyle>
                <Input.Group>
                  <Form.Item name="orgName" noStyle>
                    <Input
                      style={{
                        width: '48%',
                      }}
                      placeholder="频次范围"
                    />
                  </Form.Item>
                  <Form.Item noStyle>
                    <span
                      style={{
                        width: '2%',
                      }}
                    >
                      ~
                    </span>
                  </Form.Item>

                  <Form.Item name="orgName" noStyle>
                    <Input
                      style={{
                        width: '48%',
                      }}
                      placeholder="频次范围"
                    />
                  </Form.Item>
                </Input.Group>
              </Form.Item>
            </Col>
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button
                style={{ marginRight: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = getSearchQuery();
                  setSearChContent(search);
                }}
              >
                查询
              </Button>
              <Button
                type="primary"
                key="reset"
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
          <span>热词统计列表(共{pageInfo.totalCount || 0}个)</span>
        </div>
      </div>

      <div className={sc('container-table-body')}>
        <SelfTable
          style={{ flex: 1 }}
          rowKey="id"
          bordered
          columns={columns}
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
        <canvas id="canvas" width="400px" height="300px" style={{ height: '300px' }} />
        {/* <div
          style={{
            height: '300px',
            width: '400px',
            backgroundImage: `url(${bg})`,
            backgroundPosition: '100% 100%',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <canvas id="canvas" width="400px" height="300px" />
        </div> */}
      </div>
    </PageContainer>
  );
};
