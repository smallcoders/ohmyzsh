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
import './index.less';
import scopedClasses from '@/utils/scopedClasses';
const sc = scopedClasses('financial_data_overview');


export default () => {
  return (
    <div className={sc()}>
      <div className="left-content">
        <div className="progress">
          <div className="date">
            <DatePicker.RangePicker bordered={false} separator={<span>至</span>}  />
          </div>
          <div className="title">
            <div className="text">23年目标完成进度</div>
            <div className="edit-btn">设置</div>
          </div>
          <div className="progress-detail-list">
            <div className="financing-info">
              <div className="desc">
                <div className="desc-title">融资流水</div>
                <div className="desc-amount"><span>1,234</span><span>/200000万元</span></div>
              </div>
              <div className="progress-bar">
                <div className="current" style={{width: '35.00%'}}>35.00%</div>
              </div>
            </div>
            <div className="financing-info">
              <div className="desc">
                <div className="desc-title">融资流水</div>
                <div className="desc-amount"><span>1,234</span><span>/200000万元</span></div>
              </div>
              <div className="progress-bar">
                <div className="current" style={{width: '35.00%'}}>35.00%</div>
              </div>
            </div>
            <div className="financing-info">
              <div className="desc">
                <div className="desc-title">融资流水</div>
                <div className="desc-amount"><span>1,234</span><span>/200000万元</span></div>
              </div>
              <div className="progress-bar">
                <div className="current" style={{width: '35.00%'}}>35.00%</div>
              </div>
            </div>
          </div>
          <div className="product-rank-list">
            <div className="rank-title">金融产品热度排名</div>
            <div className="rank-list-table">
              <div className="table-header">
                <div className="title">产品</div>
                <div className="apply-amount">申请笔数</div>
                <div className="credit-amount">授信笔数</div>
              </div>
              {
                [1,2,4,4,5,6,7].map((item, index: number) => {
                  return (
                    <div className="table-item">
                      <div className="title"><span>{index + 1}</span><span>产品名称</span></div>
                      <div className="apply-amount">123,45</div>
                      <div className="credit-amount">123,45</div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
      <div className="middle-content">

      </div>
      <div className="right-content">

      </div>
    </div>
  );
};
