import {PageContainer} from "@ant-design/pro-layout";
import React, {useState} from "react";
import {Button, Col, DatePicker, Form, Input, Row, Select} from "antd";
import moment from "moment/moment";
import './index.less';
import scopedClasses from "@/utils/scopedClasses";
const sc = scopedClasses('column-manage');
export default () => {
  const [searchContent, setSearChContent] = useState<{
    activeName?: string; // 活动名称
    startTime?: string; // 活动时间
    endTime?: string; // 活动时间
    activeChannelId?: number; // 状态：0发布中、1待发布、2已下架
    activeSceneId?: number; // 状态：0发布中、1待发布、2已下架
  }>({});
  const useSearchNode = (): React.ReactNode => {
    const [searchForm] = Form.useForm();
    const formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
    return (
      <div className={sc('container-search')}>
        <Form {...formLayout} form={searchForm}>
          <Row>
            <Col span={8}>
              <Form.Item name="columnName" label="专栏名称">
                <Input placeholder="请输入" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="state" label="上下架状态">
                  <Select placeholder="请选择" allowClear>
                    <Select.Option value={'AUDIT_PASSED'}>上架</Select.Option>
                    <Select.Option value={'AUDIT_REJECTED'}>下架</Select.Option>
                  </Select>
                </Form.Item>
            </Col>
            <Col span={8}>
              <Button
                style={{ marginRight: 20, marginLeft: 20 }}
                type="primary"
                key="search"
                onClick={() => {
                  const search = searchForm.getFieldsValue();
                  const { time, ...rest } = search;
                  console.log(time)
                  if (time) {
                    rest.startTime = moment(search.time[0]).format('YYYY-MM-DD');
                    rest.endTime = moment(search.time[1]).format('YYYY-MM-DD');
                  }
                  setSearChContent(rest);
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
  return(
    <PageContainer className={sc('container')}>
      {useSearchNode()}
    </PageContainer>
  )
}
