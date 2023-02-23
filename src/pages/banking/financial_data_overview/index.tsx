import {
  DatePicker,
  Tooltip,
} from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { getCockPit } from '@/services/financial_data_overview';
import scopedClasses from '@/utils/scopedClasses';
import Map from './components/map'
import './index.less';
const sc = scopedClasses('financial-data-overview');


export default () => {
  const analysisFunnel = useRef<any>(null)
  const analysisPie = useRef<any>(null)
  const analysisStackLine = useRef<any>(null)
  const [time, setTime] = useState<any>({
    startDate: moment('2023-01-01', 'YYYY-MM-DD'),
    endDate: moment(new Date(), 'YYYY-MM-DD')
  })

  const getMainInfo = () => {
    console.log(moment(time.startDate).format('YYYY-MM-DD'))
    getCockPit({startDate: moment(time.startDate).format('YYYY-MM-DD'), endDate: moment(time.endDate).format('YYYY-MM-DD')}).then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    getMainInfo()
  }, [])

  const renderAmountAnalysis = () => {
    if (analysisStackLine.current){
      const myChart = echarts.init(analysisStackLine.current);
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['申请金额', '授信金额'],
          textStyle: {
            color: '#fff',
            lineHeight: 20,
          },
          left: 'right',
          selectedMode: false,
        },
        color: ["#5B8FF9", "#5AD8A6"],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
          axisLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.15)',
              width: 1,
              type: 'solid',
            },
            show: true,
          },
          axisTick: {
            show: true
          }
        },
        textStyle: {
          color: '#fff'
        },
        yAxis: {
          type: 'value',
          name: "万元",
          axisLine: {
            show: false,
          },
          splitLine: {
            lineStyle: {
              color: ['rgba(255,255,255,0.10)'],
              width: 1,
              type: 'dashed'
            },
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            name: '申请金额',
            type: 'line',
            data:[220, 182, 191, 234, 290, 330, 310, 191, 234, 290, 330, 310]
          },
          {
            name: '授信金额',
            type: 'line',
            data: [120, 132, 101, 134, 90, 230, 210, 101, 134, 90, 230, 210]
          }
        ]
      };
      myChart.setOption(option);
    }
  }

  const renderTransformAnalysis = () => {
    if (analysisFunnel.current){
      const myChart = echarts.init(analysisFunnel.current);
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c}'
        },
        color: ["#037BF4", "#019FE9", "#048BD6", "#0362A5", "#023488"],
        height: '100%',
        series: [
          {
            name: '金融服务转化分析',
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
              formatter: '{weight|{b}}\n{c}',
              color: '#fff',
              lineHeight: 16,
              rich: {
                weight: {
                  fontWeight: 'bold',
                }
              },
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
      const amount = '12,330'
      const a = 800
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: `{b} <br/> {c}万元 <br/> 占比${a}`
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          selectedMode: false,
          align: 'left',
          icon: "circle",
          top: '10%',
          formatter: (name: string) => {
            if (name === '保险业务'){
              return `${name} ${800 / 20000} \n {blue|${a}万元}`
            }
            if (name === '租赁业务'){
              return `${name} ${800 / 20000} \n {blue|${a}万元}`
            }
            if (name === '贷款业务'){
              return `${name} ${800 / 20000} \n {blue|${a}万元}`
            }
            return ''
          },
          textStyle: {
            color: '#fff',
            lineHeight: 20,
            rich: {
              blue: {
                color: '#00C2FF',
              }
            },
          }
        },
        left: 0,
        top: 0,
        bottom: 0,
        height: '100%',
        width: '100%',
        color: ["#037BF4","#FF9B5F", "#33D0E1"],
        series: [
          {
            name: '各业务类型授信占比',
            type: 'pie',
            radius: ['45%', '70%'],
            label: {
              show: true,
              position: 'center',
              formatter: `总金额(万元)\n${amount}万元`,
              lineHeight: 18,
              color: '#fff'
            },
            avoidLabelOverlap: false,
            left: "0%",
            emphasis: {
              disabled: true
            },
            center: ['30%', '50%'],
            labelLine: {
              show: false
            },
            colorBy: "data",
            itemStyle: {
              borderWidth: 0
            },
            data: [
              { value: 900.00, name: '贷款业务' },
              { value: 360.00, name: '租赁业务' },
              { value: 360.00, name: '保险业务' },
            ]
          }
        ],
        markPoint: {
          symbol: 'pin',
        }
      };
      myChart.setOption(option);
    }
  }

  useEffect(() => {
    renderRateAnalysis()
    renderTransformAnalysis()
    renderAmountAnalysis()
  }, [])


  const screenWidth = document.body.clientWidth / 1920 * 460
  return <div className={sc()}>
    <div className="middle-title">羚羊数字金融驾驶舱</div>
    <div className="content" style={{padding: `0 ${document.body.clientWidth / 1920 * 20}px`}}>
      <div className="left-content" style={{width: `${screenWidth}px`}}>
        <div className="progress">
          <div className="date-box">
            <DatePicker.RangePicker
              dropdownClassName="financial-overview-time"
              allowClear={false}
              suffixIcon={null}
              bordered={false}
              separator={<span>至</span>}
              defaultValue={[time.startDate, time.endDate]}
              disabledDate={(current) => {
                return current && current > moment().subtract(1, 'day') || current < moment('2023-01-01')
              }}
            />
          </div>
          <div className="progress-title">
            <div className="text">23年目标完成进度</div>
            <div className="edit-btn"><span className="icon" /><span>设置</span></div>
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
              <div className="table-body">
                {
                  [1,2,4,4,5,6,7].map((item, index: number) => {
                    return <div className="table-item" key={index}>
                        <div className="title">
                          {
                            index > 2 ? <span className="index">{index + 1}</span> :
                              <span className={`index-${index + 1}`} />
                          }
                          <Tooltip title="产品名称">
                            <span>产品名称</span>
                          </Tooltip>
                        </div>
                        <div className="apply-amount">123,45</div>
                        <div className="credit-amount">123,45</div>
                      </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="middle-content">
        <div className="data-summary">
          <div className="item">
            <div className="data-title">
              注册企业<span>(家)</span>
            </div>
            <div className="amount">22,355</div>
            <div className="change-amount">近三日: +20</div>
            <div className="change-amount">较上月: <span>+20</span></div>
          </div>
          <div className="item">
            <div className="data-title">
              融资申请金额<span>(万元)</span>
            </div>
            <div className="amount">22,355</div>
            <div className="change-amount">近三日: +20</div>
            <div className="change-amount">较上月: <span>+20</span></div>
          </div>
          <div className="item">
            <div className="data-title">
              授信金额<span>(万元)</span>
            </div>
            <div className="amount">22,355</div>
            <div className="change-amount">近三日: +20</div>
            <div className="change-amount">较上月: <span>+20</span></div>
          </div>
          <div className="item">
            <div className="data-title">
              金融客户<span>(个)</span>
            </div>
            <div className="amount">22,355</div>
            <div className="change-amount">近三日: +20</div>
            <div className="change-amount">较上月: <span>+20</span></div>
          </div>
          <div className="item">
            <div className="data-title">
              金融诊断<span>(次)</span>
            </div>
            <div className="amount">22,355</div>
            <div className="change-amount">近三日: +20</div>
            <div className="change-amount">较上月: <span>+20</span></div>
          </div>
        </div>
        <div className="map" style={{paddingLeft: `${document.body.clientWidth / 1920 * 36}px`}}>
          <Map />
          <div className="city-info" style={{marginLeft: `${document.body.clientWidth / 1920 * 24}px`}}>
            <div className="city-info-title">
              <div className="circle">
                <div className="inner-circle"/>
              </div>
              合肥市
            </div>
            <div className="city-info-desc">
              <div className="city-info-header">
                <div className="info-name">名称</div>
                <div className="info-amount">当前数据</div>
                <div className="last">较上月</div>
              </div>
              <div className="city-info-body">
                {
                  [1,2,3,4,5,6,7].map((item, index: number) => {
                    return <div className="info-item" key={index}>
                        <div className="info-name">融资申请金额 <span>(家)</span></div>
                        <div className="info-amount">37,654</div>
                        <div className="last">+50</div>
                      </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="middle-bottom">
          <div className="rate-analysis">
            <div className="analysis-title">各业务类型授信占比</div>
            <div ref={analysisPie} className="analysis-pie" />
          </div>
          <div className="amount-analysis">
            <div className="analysis-title">融资申请及授信月度分析</div>
            <div ref={analysisStackLine} className="analysis-stack-line" />
          </div>
        </div>
      </div>
      <div className="right-content" style={{width: `${screenWidth}px`}}>
        <div className="bank-list">
          <div className="bank-list-title">金融机构排名</div>
          <div className="list-box">
            {
              [1,2,3,4,5,6,6,8].map((item, index: number) => {
                return <div className="bank-list-item" key={index}>
                    <div className="list-item-desc">
                      <div className="left-desc"><span>{index + 1}</span><span>中国银行</span></div>
                      <div className="amount">12000万元</div>
                    </div>
                    <div className="bar">
                      <div style={{width: '45%'}} className="real-rate" />
                    </div>
                  </div>
              })
            }
          </div>
        </div>
        <div className="transform-analysis">
          <div className="analysis-title">金融服务转化分析</div>
          <div className="rate-1"><span className="line"/>Rate: 46.88%</div>
          <div className="rate-2"><span className="line"/>Rate: 46.88%</div>
          <div className="rate-3"><span className="line"/>Rate: 46.88%</div>
          <div className="rate-4"><span className="line"/>Rate: 46.88%</div>
          <div ref={analysisFunnel} className="analysis-funnel" />
        </div>
      </div>
    </div>
  </div>;
};
