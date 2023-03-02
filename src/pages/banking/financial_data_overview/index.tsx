import {
  DatePicker, Popover,
  Tooltip,
  message
} from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { getCockPit, getSummaryAndMap, queryCVR } from '@/services/financial_data_overview';
import scopedClasses from '@/utils/scopedClasses';
import { customToFixed, formatPrice } from '@/utils/util';
import OverViewModal from './components/OverViewModal'
import Map from './components/map'
import './index.less';
const sc = scopedClasses('financial-data-overview');

interface remAdaptionInfo {
  originWidth?: number
  minWidth?: number
}

function windowZoom(data: remAdaptionInfo): void {
  const { originWidth = 3840, minWidth = 1280 } = data
  const innerWidth = window.innerWidth
  if (!innerWidth) return
  document.querySelector('.financial-data-overview')?.setAttribute('style', `transform: scale(${Math.max(innerWidth, minWidth) / originWidth})`)
}

export default () => {
  const analysisFunnel = useRef<any>(null)
  const analysisPie = useRef<any>(null)
  const analysisStackLine = useRef<any>(null)
  const cityInfoRef = useRef<any>(null)
  const analysisFunnelEcharts = useRef<any>(null)
  const analysisPieEcharts = useRef<any>(null)
  const analysisStackLineEcharts = useRef<any>(null)
  const modalRef = useRef<any>(null)
  const [ mainInfo, setMainInfo ] = useState<any>(null)
  const [currentCityCode, setCurrentCityCode] = useState<number>(340100)
  const [cvrList, setCvrList] = useState<number[]>([])
  const [mapAndOverViewInfo, setMapAndOverViewInfo] = useState<any>({overviewVO: null, mapVO: null})
  const [time, setTime] = useState<any>({
    startDate: moment('2023-01-01', 'YYYY-MM-DD'),
    endDate: moment(new Date(), 'YYYY-MM-DD')
  })

  // 获取静态数据  目标  地图  总览
  const getMainInfo = () => {
    getCockPit().then((res) => {
      if (res.code === 0) {
        if (res.result){
          setMapAndOverViewInfo(res.result)
        }
      } else {
        message.error(res.message)
      }
    })
  }

  const renderAmountAnalysis = (monthlyAnalysisVO: any) => {
    if (analysisStackLine.current){
      if (!analysisStackLineEcharts.current) {
        analysisStackLineEcharts.current = echarts.init(analysisStackLine.current)
      }
      const xAxisData = monthlyAnalysisVO.map((item: any) => {
        return item?.month?.split('-')[1]
      })
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params: any) => {
            return `${(params[0]?.data || {}).time} <br/> 申请金额：${params[0].value || '0.00'}万元 <br/> 授信金额: ${params[1].value || '0.00'}万元`
          },
          backgroundColor: 'rgba(12,60,140, 0.98)',
          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
          },
          borderColor: 'rgba(12,60,140, 0.98)'
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
          data: xAxisData,
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
            data: monthlyAnalysisVO?.map((item: any) => {
              return {
                value: customToFixed(`${item?.applyAmount / 1000000}`),
                name: '授信金额',
                time: item?.month
              }
            }) || []
          },
          {
            name: '授信金额',
            type: 'line',
            data: monthlyAnalysisVO?.map((item: any) => {
              return {
                value: customToFixed(`${item?.creditAmount / 1000000}`),
                name: '授信金额',
                time: item?.month
              }
            }) || []
          }
        ]
      };
      analysisStackLineEcharts.current.setOption(option);
    }
  }

  const renderTransformAnalysis = (params: number[]) => {
    if (analysisFunnel.current){
      if (!analysisFunnelEcharts.current) {
        analysisFunnelEcharts.current = echarts.init(analysisFunnel.current)
      }
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} <br/>{c}',
          backgroundColor: 'rgba(12,60,140, 0.98)',
          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
          },
          borderColor: 'rgba(12,60,140, 0.98)'
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
            min: params[4],
            max: params[0],
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
              { value: params[0], name: '金融服务用户量' },
              { value: params[1], name: '查看产品用户量' },
              { value: params[2], name: '产品申请用户量' },
              { value: params[3], name: '授信通过用户量' },
              { value: params[4], name: '授信放款用户量' }
            ]
          }
        ]
      };
      analysisFunnelEcharts.current.setOption(option);
    }
  }

  const renderRateAnalysis = (creditRatioVO: any) => {
    if (analysisPie.current){
      if (!analysisPieEcharts.current) {
        analysisPieEcharts.current = echarts.init(analysisPie.current)
      }
      let amount: number | string = 0
      const data = [
        { value: 0.00, name: '贷款业务', rate: '0.00%', amount: 0,  },
        { value: 0.00, name: '租赁业务', rate: '0.00%', amount: 0,  },
        { value: 0.00, name: '保险业务', rate: '0.00%', amount: 0,  }
      ]
      creditRatioVO.forEach((item: any) => {
        amount += item.amount || 0
        if (item.type === 1) {
          data[0].value = Number(customToFixed(`${item.amount / 1000000}`))
          data[0].rate = item.rate
          data[0].amount = item.amount
        }
        if (item.type === 3) {
          data[1].value = Number(customToFixed(`${item.amount / 1000000}`))
          data[1].rate = item.rate
          data[1].amount = item.amount
        }
        if (item.type === 5) {
          data[2].value = Number(customToFixed(`${item.amount / 1000000}`))
          data[2].rate = item.rate
          data[2].amount = item.amount
        }
      })
      data.sort((a, b) => {
        return a.amount- b.amount
      })
      console.log(data)
      amount = formatPrice(customToFixed(`${(amount || 0) / 1000000}`))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: (params: any) => {
            return `${params.name} <br/> 金额：${params.value}万元 <br/> 占比: ${params?.data?.rate || '0.00%'}`
          },
          backgroundColor: 'rgba(12,60,140, 0.98)',
          borderColor: 'rgba(12,60,140, 0.98)',
          textStyle: {
            color: '#fff',
            fontWeight: 'bold',
          }
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          selectedMode: false,
          align: 'left',
          icon: "circle",
          top: '10%',
          formatter: (name: string) => {
            const item = data.find((it) => {
              return it.name === name
            })
            if (name === '保险业务'){
              return `${name} \n ${item?.rate || '0.00%'} {blue|${item?.value}万元}`
            }
            if (name === '租赁业务'){
              return `${name} \n ${item?.rate || '0.00%'}  {blue|${item?.value}万元}`
            }
            if (name === '贷款业务'){
              return `${name} \n ${item?.rate || '0.00%'}  {blue|${item?.value}万元}`
            }
            return ''
          },
          textStyle: {
            color: '#fff',
            lineHeight: 20,
            rich: {
              blue: {
                color: '#47DBFF',
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
            center: ['26%', '50%'],
            labelLine: {
              show: false
            },
            colorBy: "data",
            itemStyle: {
              borderWidth: 0
            },
            data
          }
        ],
        markPoint: {
          symbol: 'pin',
        }
      };
      analysisPieEcharts.current.setOption(option);
    }
  }

  // 获取 时间控制的数据
  const getChangeMainInfo = (date: any) => {
    const params = {startDate: moment(date.startDate).format('YYYY-MM-DD'), endDate: moment(date.endDate).format('YYYY-MM-DD')}
    getSummaryAndMap(params).then((res) => {
      if (res.code === 0 && res.result) {
        setMainInfo(res.result)
        renderRateAnalysis(res.result.creditRatioVO)
        renderAmountAnalysis(res.result.monthlyAnalysisVO)
      }
      if (res.code !== 0){
        message.error(res.message)
      }
    })
    queryCVR(params).then((res) => {
      if (res.code === 0 && res.result) {
        setCvrList(res.result)
        renderTransformAnalysis(res.result)
      }
      if (res.code !== 0){
        message.error(res.message)
      }
    })
  }

  const selectTime = (date: any) => {
    if (date?.[0] && date?.[1]){

      const startDate = moment(date[0], 'YYYY-MM-DD')
      const endDate = moment(date[1], 'YYYY-MM-DD')
      setTime({
        startDate,
        endDate,
      })
      getChangeMainInfo({
        startDate,
        endDate
      })
    }
  }

  useEffect(() => {
    windowZoom({ originWidth: 1920, minWidth: 1200 })
    const handleChangeScale = () => {
      windowZoom({ originWidth: 1920, minWidth: 1200 })
    }
    window.addEventListener('resize', handleChangeScale)
    document.body.setAttribute('style', 'background: #02061c')
    getMainInfo()
    getChangeMainInfo(time)
    return () => {
      document.body.removeAttribute('style')
      window.removeEventListener('resize', handleChangeScale)
    }
  }, [])




  const {overviewVO = {},  mapVO = [] , targetProgressVO = {} } = mapAndOverViewInfo || {}
  const { productHotVO, bankCreditRankVO } = mainInfo || {}

  const currentMapVO = mapVO?.find((item: any) => {
    return item.cityCode === currentCityCode
  })
  return (
    <div className={sc()}>
      <div className="middle-title">羚羊数字金融驾驶舱</div>
      <div className="content">
        <div className="left-content">
          <div className="date-box">
            <DatePicker.RangePicker
              dropdownClassName="financial-overview-time"
              allowClear={false}
              suffixIcon={null}
              bordered={false}
              onChange={selectTime}
              separator={<span>至</span>}
              defaultValue={[time.startDate, time.endDate]}
              disabledDate={(current) => {
                return current && current > moment().subtract(0, 'day')
              }}
            />
          </div>
          <div className="progress">
            <div className="progress-title">
              <div className="text">{targetProgressVO.targetName}</div>
              <Popover
                placement="bottomRight"
                overlayClassName="edit-btn-popover"
                content={
                  <>
                    <div
                      onClick={() => {
                        modalRef.current.openModal(1)
                      }}
                    >
                      设置分润金额
                    </div>
                    <div
                      onClick={() => {
                        modalRef.current.openModal(2)
                      }}
                    >
                      设置项目合同额
                    </div>
                  </>
                }
                trigger="hover"
              >
                <div className="edit-btn"><span className="icon" /><span>设置</span></div>
              </Popover>
            </div>
            <div className="progress-detail-list">
              {
                targetProgressVO?.list?.map((item: any, index: number) => {
                  return (
                    <div className="financing-info" key={index}>
                      <div className="desc">
                        <div className="desc-title">
                          {
                            item.type === 1 ? '融资流水' : item.type === 2 ? '分润金额' : '项目合同额'
                          }
                        </div>
                        <div className="desc-amount">
                          <span>{formatPrice(customToFixed(`${(item.occupyAmount || 0) / 1000000}`, 0))}</span><span>/{formatPrice(customToFixed(`${item.targetAmount / 1000000}`, 0))}万元</span>
                        </div>
                      </div>
                      <div className="progress-bar">
                        <div style={item.occupyAmount === 0 ? {paddingRight: 0, width: `${item.rate}`} : {width: `${item.occupyAmount > item.targetAmount ? '100%' : item.rate}`}} className="current">{item.rate}</div>
                      </div>
                    </div>
                  )
                })
              }
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
                  productHotVO && productHotVO.map((item: any, index: number) => {
                    return <div className="table-item" key={index}>
                      <div className="title">
                        {
                          index > 2 ? <span className="index">{index + 1}</span> :
                            <span className={`index-${index + 1}`} />
                        }
                        <Tooltip title={item.name} placement="topLeft">
                          <span>{item.name}</span>
                        </Tooltip>
                      </div>
                      <div className="apply-amount">{formatPrice(`${item.applyNum || 0}`)}</div>
                      <div className="credit-amount">{formatPrice(`${item.creditNum || 0}`)}</div>
                    </div>
                  })
                }
              </div>
            </div>
          </div>
        </div>
        <div className="middle-content">
          <div className="data-summary">
            {
              overviewVO && overviewVO.map((item: any, index: number) => {
                return (
                  <div className="item" key={index}>
                    <div className="data-title">
                      {
                        item.type === 1 ? <>注册企业<span>(家)</span></> : item.type === 2 ? <>融资申请金额<span>(万元)</span></>
                          : item.type == 3 ? <>授信金额<span>(万元)</span></> : item.type === 4 ? <>金融客户<span>(个)</span></>
                            : <>金融诊断<span>(次)</span></>
                      }

                    </div>
                    <div className="amount">{item.type === 2 || item.type === 3 ? formatPrice(customToFixed(`${item.num / 1000000}`)) : formatPrice(`${item.num || 0}`) }</div>
                    <div className="change-amount">
                      近三日: +{item.type === 2 || item.type === 3 ? formatPrice(customToFixed(`${item.threeDay / 1000000}`)) : formatPrice(`${item.threeDay || 0}`) }
                    </div>
                    <div className="change-amount">
                      较上月: <span>+{item.type === 2 || item.type === 3 ? formatPrice(customToFixed(`${item.thisMonth / 1000000}`)) : formatPrice(`${item.thisMonth || 0}`) }</span>
                    </div>
                  </div>
                )
              })
            }
          </div>
          <div className="map">
            <div className="line2" style={{
              left: `${398}px`,
              right: `${cityInfoRef.current?.offsetWidth || 412}px`
            }} />
            <div className="map-box">
              <Map getCityInfo={setCurrentCityCode} />
              <div className="line1" />
            </div>
            <div ref={cityInfoRef} className="city-info">
              <div className="city-info-title">
                <div className="circle">
                  <div className="inner-circle"/>
                </div>
                {currentMapVO && currentMapVO.cityName || '合肥市'}
              </div>
              <div className="city-info-desc">
                <div className="city-info-header">
                  <div className="info-name">名称</div>
                  <div className="info-amount">当前数据</div>
                  <div className="last">较上月</div>
                </div>
                <div className="city-info-body">
                  {
                    currentMapVO && currentMapVO.mapDetailVO?.map((item: any, index: number) => {
                      return (
                        <div className="info-item" key={index}>
                          <div
                            className="info-name"
                            dangerouslySetInnerHTML={{__html: item.name?.replace(/\((.+?)\)/g, (res: string) => {
                                return  `<span>${res}</span>`
                              })}}
                          />
                          <div className="info-amount">{index > 3 ? formatPrice(customToFixed(`${item.num / 1000000}`)) : formatPrice(`${item.num || 0}`)}</div>
                          <div className="last">+{index > 3 ? formatPrice(customToFixed(`${item.thisMonth / 1000000}`)) : formatPrice(`${item.thisMonth || 0}`)}</div>
                        </div>
                      )
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
        <div className="right-content">
          <div className="bank-list">
            <div className="bank-list-title">金融机构授信排名</div>
            <div className="list-box">
              {
                bankCreditRankVO && bankCreditRankVO.map((item: any, index: number) => {
                  return <div className="bank-list-item" key={index}>
                    <div className="list-item-desc">
                      <div className="left-desc"><span>{index + 1}</span><span>{item.name}</span></div>
                      <div className="amount">{formatPrice(customToFixed(`${item.amount / 1000000 || 0}`))}万元</div>
                    </div>
                    <div className="bar">
                      <div style={{width: index === 0 ? '95%' : `${(item.amount / (bankCreditRankVO[0].amount / 95 * 100) * 100).toFixed(2)}%`}} className="real-rate" />
                    </div>
                  </div>
                })
              }
            </div>
          </div>
          <div className="transform-analysis">
            <div className="analysis-title">金融服务转化分析</div>
            {
              cvrList.length > 0 && <>
                {
                  cvrList[0] > 0 ? <div className="rate-1"><span className="line"/>Rate: {(cvrList[1] / cvrList[0] * 100).toFixed(2)}%</div> : null
                }
                {
                  cvrList[1] > 0 ? <div className="rate-2"><span className="line"/>Rate: {(cvrList[2] / cvrList[1] * 100).toFixed(2)}%</div> : null
                }
                {
                  cvrList[2] > 0 ? <div className="rate-3"><span className="line"/>Rate: {(cvrList[3] / cvrList[2] * 100).toFixed(2)}%</div> : null
                }
                {
                  cvrList[3] > 0 ? <div className="rate-4"><span className="line"/>Rate: {(cvrList[4] / cvrList[3] * 100).toFixed(2)}%</div> : null
                }
              </>
            }
            <div ref={analysisFunnel} className="analysis-funnel" />
          </div>
        </div>
      </div>
      <OverViewModal successCallBack={getMainInfo} ref={modalRef} />
    </div>
  )
};
