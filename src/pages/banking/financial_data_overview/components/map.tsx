import { useEffect, useState, Fragment, useRef } from 'react'
import { Image } from 'antd'
import AnHuiProvince from '@/assets/financial/anhui-province.png'
import mapData from '../map-data'
import AreaMark from './area_mark'
export default (props: any) => {
  const { style } = props || {}
  const [hoverArea, setHoverArea] = useState<number>(-1)
  const [curAreaItem, setCurAreaItem] = useState<any>({})
  const [nextArea, setNextArea] = useState<number>(-1)
  const autoChangeTimer = useRef<any>(null)
  const [currentArea, setCurrentArea] = useState<any>(null)

  const changeArea = (code: number) => {
    if (props.getCityInfo){
      props.getCityInfo(code)
    }
    setCurrentArea(code)
  }

  useEffect(() => {
    changeArea(mapData[0]?.code)
  }, [])

  // 自动轮播
  const handleAutoChangeTab = () => {
    const timeFun = () => {
      if (autoChangeTimer.current){
        clearTimeout(autoChangeTimer.current)
      }
      autoChangeTimer.current = setTimeout(() => {
        changeArea(nextArea)
        timeFun()
      }, 5000)
    }
    timeFun()
  }

  useEffect(() => {
    handleAutoChangeTab()
    return () => {
      if (autoChangeTimer.current){
        clearInterval(autoChangeTimer.current)
      }
    }
  }, [nextArea])

  useEffect(() => {
    if (!currentArea) return
    let ind = -1
    const currentAreaItem =
      mapData?.find((item: any, index: number) => {
        if (item.code === currentArea) {
          ind = index
          return true
        }
        return false
      }) || null
    const nextAreaItem = ind >= mapData.length - 1 ? mapData[0] : mapData[ind + 1]
    setCurAreaItem(currentAreaItem)
    setNextArea(nextAreaItem?.code)
  }, [currentArea])

  return (
    <div className="map-area" style={style}>
      <div className="map-area-content">
        <Image width={403} height={508} preview={false} src={AnHuiProvince} />
        <div className='map-area-content-area'>
          <svg
            width="403px"
            height="508px"
            viewBox="0 0 403 508"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mapData?.map((item: any) => {
              const { code, name, city, position, activeLinearGradient, g2, g3, path } = item
              const { id: linearGradientId, pos } = activeLinearGradient
              return (
                <Fragment key={code}>
                  <defs>
                    <linearGradient
                      x1={pos.x1}
                      y1={pos.y1}
                      x2={pos.x2}
                      y2={pos.y2}
                      id={linearGradientId}
                    >
                      <stop stopColor="#3EFFEE" offset="0%"></stop>
                      <stop stopColor="#0BCAFF" offset="100%"></stop>
                    </linearGradient>
                  </defs>
                  <g
                    id={name}
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                    strokeOpacity={[currentArea, hoverArea].includes(code) ? '1' : '0.504397946'}
                    style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
                  >
                    <g
                      transform={
                        [currentArea, hoverArea].includes(code)
                          ? g2.active.transform
                          : g2.default.transform
                      }
                      fill={
                        [currentArea, hoverArea].includes(code)
                          ? `url(#${linearGradientId})`
                          : 'transparent'
                      }
                      stroke={[currentArea, hoverArea].includes(code) ? '#FFF' : '#4899D0'}
                      strokeWidth={[currentArea, hoverArea].includes(code) ? 2 : 0.5}
                    >
                      <g
                        transform={
                          [currentArea, hoverArea].includes(code)
                            ? g3.active.transform
                            : g3.default.transform
                        }
                      >
                        <path
                          onClick={() => changeArea(code)}
                          onMouseOver={() => setHoverArea(code)}
                          onMouseOut={() => setHoverArea(-1)}
                          id={city}
                          d={path}
                        ></path>
                      </g>
                    </g>
                  </g>
                </Fragment>
              )
            })}
          </svg>
          <AreaMark
            title={curAreaItem?.city}
            pos={{ x: curAreaItem?.centerPos?.x, y: curAreaItem?.centerPos?.y }}
          />
        </div>
      </div>
    </div>
  )
}
