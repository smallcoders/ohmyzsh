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
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';
import scopedClasses from '@/utils/scopedClasses';
import './index.less';
const sc = scopedClasses('financial_data_overview');


export default () => {
  const analysisFunnel = useRef<any>(null)
  const analysisPie = useRef<any>(null)
  const renderTransformAnalysis = () => {
    if (analysisFunnel.current){
      const myChart = echarts.init(analysisFunnel.current);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c}'
        },
        color: ["#037BF4", "#019FE9", "#048BD6", "#023488", "#023488"],
        series: [
          {
            name: 'Funnel',
            type: 'funnel',
            left: '0',
            top: 0,
            bottom: 0,
            width: '100%',
            min: 2000,
            max: 23456,
            minSize: '10%',
            maxSize: '100%',
            sort: 'descending',
            label: {
              show: true,
              position: 'inside',
              formatter: '{b}\n{c}'
            },
            emphasis: {
              disabled: true
            },
            colorBy: "data",
            itemStyle: {
              borderWidth: 0
            },
            data: [
              { value: 23456, name: '金融服务用户量' },
              { value: 8900, name: '查看产品用户量' },
              { value: 5000, name: '产品申请用户量' },
              { value: 3800, name: '授信通过用户量' },
              { value: 2000, name: '授信放款用户量' }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }

  const renderRateAnalysis = () => {
    if (analysisPie.current){
      const myChart = echarts.init(analysisPie.current);
      const option = {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ]
          }
        ]
      };
      myChart.setOption(option);
    }
  }

  useEffect(() => {
    renderRateAnalysis()
    renderTransformAnalysis()
  }, [])


  const screenWidth = document.body.clientWidth / 1920 * 388
  return (
    <div className={sc()}>
      <div className="left-content" style={{width: `${screenWidth}px`}}>
        <div className="progress">
          <div className="date">
            <DatePicker.RangePicker bordered={false} separator={<span>至</span>}  />
          </div>
          <div className="progress-title">
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
                    <div className="table-item" key={index}>
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
        <div className="middle-title">羚羊数字金融驾驶舱</div>
        <div className="data-summary">
        </div>
        <div className="map">

        </div>
        <div className="middle-bottom">
          <div className="rate-analysis" style={{paddingRight: `${document.body.clientWidth / 1920 * 56}px`}}>
            <div className="analysis-title">金融服务转化分析</div>
            <div ref={analysisPie} className="analysis-pie" />
          </div>
          <div className="amount-analysis" style={{paddingLeft: `${document.body.clientWidth / 1920 * 56}px`}}>
            <div className="analysis-title">金融服务转化分析</div>
          </div>
        </div>
      </div>
      <div className="right-content" style={{width: `${screenWidth}px`}}>
       <div className="bank-list">
         <div className="bank-list-title">金融机构排名</div>
         {
           [1,2,3,4,5,6,6,8].map((item, index: number) => {
             return (
               <div className="bank-list-item" key={index}>
                 <div className="list-item-desc">
                   <div className="left-desc"><span>{index + 1}</span><span>中国银行</span></div>
                   <div className="amount">12000万元</div>
                 </div>
                 <div className="bar">
                   <div style={{width: '45%'}} className="real-rate" />
                 </div>
               </div>
             )
           })
         }
         <div className="transform-analysis">
           <div className="analysis-title">金融服务转化分析</div>
           <div ref={analysisFunnel} className="analysis-funnel" />
         </div>
       </div>
      </div>
    </div>
  );
};
