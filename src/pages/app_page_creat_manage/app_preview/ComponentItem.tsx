import { useEffect, useRef, useState } from 'react';
import { Carousel } from 'antd';
import playIcon from '@/assets/page_creat_manage/play_icon.png'
const ComponentItem = (props: any) => {
  const {
    item: { type, config },
  } = props
  const [isPlay, setIsPlay] = useState<boolean>(false)
  const [showControls, setShowControls] = useState<boolean>(false)
  const videoRef = useRef<any>(null)

  const playVideo = (e: any, status: boolean) => {
    if (!videoRef) return
    if (!isPlay && e) {
      e.stopPropagation()
    }
    // 只有播放，没有暂停
    setIsPlay(status)
  }
  useEffect(() => {
    if (!videoRef || !videoRef?.current) {
      return
    }
    if (isPlay) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }, [isPlay])

  const imgWidth = type !== 'Image' ? 0 : config?.imgStyle === 'matrix' ?
    `1200px` : config?.imgStyle === 'main' ? `${config?.imgWidth}px` : config?.imgWidth > screen.width ? `${screen.width}px` : `${config?.imgWidth}px`
  const imgHeight = type !== 'Image' ? 0 : config?.imgStyle === 'matrix' ?
    `${config?.imgHeight * config.lineNumber + (config.lineNumber - 1) * 12}px` : `${config?.imgHeight}px`
  return (
    <div>
      {
        type === 'Title' && (
          <div
            style={{
              fontWeight: config?.fontWeight,
              fontSize: `${config?.fontSize}px`,
              color: `${config?.color}`,
              lineHeight: `${config?.lineHeight}px`,
              textAlign: config?.textAlign === 'justifyAlign' ? 'left' : config?.textAlign,
              paddingTop: `${config?.paddingTop * screen.width / 1920}px`,
              paddingBottom: `${config?.paddingBottom * screen.width / 1920}px`,
              width: `1200px`,
              margin: '0 auto'
            }}
          >
            {config?.text}
          </div>
        )
      }
      {
        type === 'Title' && config?.subTitle?.text && (
          <div
            style={{
              fontWeight: config?.subTitle?.fontWeight,
              fontSize: `${config?.subTitle?.fontSize}px`,
              color: `${config?.subTitle?.color}`,
              lineHeight: `${config?.subTitle?.lineHeight}px`,
              textAlign: config?.subTitle?.textAlign === 'justifyAlign' ? 'left' : config?.subTitle?.textAlign,
              paddingTop: `${config?.subTitle?.paddingTop}px`,
              paddingBottom: `${config?.subTitle?.paddingBottom}px`,
              width: `1200px`,
              margin: '0 auto'
            }}
          >
            {config.subTitle.text}
          </div>
        )
      }
      {
        type === 'Text' && (
          <div
            style={{
              fontWeight: config?.fontWeight,
              fontSize: `${config?.fontSize}px`,
              color: `${config?.color}`,
              lineHeight: `${config?.lineHeight}px`,
              textAlign: config?.textAlign === 'justifyAlign' ? 'left' : config?.textAlign,
              paddingTop: `${config?.paddingTop}px`,
              paddingBottom: `${config?.paddingBottom}px`,
              width: `1200px`,
              margin: '0 auto'
            }}
          >
            {config?.text}
          </div>
        )
      }
      {
        type === 'Video' && (
          <div
            style={{
              height: `${config?.videoAreaHeight}px`,
              width: `${config?.videoAreaWidth}px`,
            }}
            className="video-box"
            onClick={e => {
              playVideo(e, !isPlay)
            }}
          >
            {
              config?.url &&
              <video
                src={config?.url}
                preload="true"
                width="100%"
                height="100%"
                muted
                loop={false}
                controls={showControls}
                onMouseEnter={() => {
                  setShowControls(true)
                }}
                onMouseLeave={() => {
                  setShowControls(false)
                }}
                ref={videoRef}
                // 隐藏下载按钮
                controlsList="nodownload"
                // 此属性在android设备播放视频时,导致自动全屏播放
                // x5-video-player-type="h5-page"
                /**
                 * ios系统
                 * 内联播放
                 */
                playsInline
                /* eslint-disable-next-line react/no-unknown-property */
                webkit-playsinline="true"
                /**
                 * 同层h5播放器
                 * 网页内部同层播放
                 * 视频上方显示html元素
                 *  */
                /* eslint-disable-next-line react/no-unknown-property */
                x5-playsinline="true"
                onPause={e => {
                  playVideo(e, false)
                }}
                onEnded={e => {
                  playVideo(e, false)
                }}
                onPlay={e => {
                  playVideo(e, true)
                }}
              />
            }
            {
              !isPlay ?
                config?.coverImageUrl ?
                  <img src={config.coverImageUrl} alt='' className="poster-img" />
                  : <div className="mask" />
                : null
            }
            {!isPlay ? <img src={playIcon} className="play-icon" /> : null}
          </div>
        )
      }
      {
        type === 'Image' &&
        <div
          style={{
            height: imgHeight,
            width: imgWidth,
            borderRadius: config?.imgStyle === 'main' ? '8px' : '0'
          }}
          className={config?.imgStyle === 'matrix' ? "img-list-box matrix" : "img-list-box"}
        >
          {
            config?.imgStyle === 'matrix' ?
              config?.imgList.map((imgItem: { index: number, link: string, img: string }, id: number) => {
                const marginBottom = id + 1 <= (config.lineNumber - 1) * config.columnNumber ? `12px` : '0'
                const marginRight = (id + 1) % config.columnNumber !== 0 ? config.columnNumber === 5 ? `20px` : `24px` : '0'
                return (
                  <div
                    className="img-item-box"
                    key={id}
                    style={{
                      marginBottom,
                      marginRight
                    }}
                  >
                    {
                      imgItem.img ?
                        <img
                          style={{
                            height: config?.imgHeight,
                            width: config?.imgWidth,
                            objectFit: "cover",
                            borderRadius: '4px'
                          }}
                          src={imgItem.img}
                          onClick={() => {
                            if (imgItem.link) {
                              window.location.href = imgItem.link
                            }
                          }}
                          alt=''
                        /> :
                        <div
                          style={{
                            height: config?.imgHeight,
                            width: config?.imgWidth,
                            background: 'ccc',
                          }}
                        />
                    }
                  </div>
                )
              }) :
              config?.isCarousel ?
                <Carousel
                  autoplay
                  autoplaySpeed={config?.duration * 1000}
                >
                  {
                    config?.imgList.map((imgItem: { index: number, link: string, img: string }, index: number) => {
                      return (
                        <div
                          className="img-item-box"
                          key={index}
                        >
                          {
                            imgItem.img ?
                              <img
                                style={{
                                  height: imgHeight,
                                  width: imgWidth,
                                  objectFit: "cover",
                                  borderRadius: config?.imgStyle === 'main' ? '8px' : '0'
                                }}
                                src={imgItem.img}
                                onClick={() => {
                                  if (imgItem.link) {
                                    window.location.href = imgItem.link
                                  }
                                }}
                                alt=''
                              /> :
                              <div
                                style={{
                                  height: imgHeight,
                                  width: imgWidth,
                                  background: 'ccc',
                                }}
                              />
                          }
                        </div>
                      )
                    })
                  }
                </Carousel> :
                <div
                  className="img-item-box"
                >
                  {
                    config?.imgList[0].img ?
                      <img
                        style={{
                          height: imgHeight,
                          width: imgWidth,
                          objectFit: "cover",
                          borderRadius: config?.imgStyle === 'main' ? '8px' : '0'
                        }}
                        src={config?.imgList[0].img}
                        onClick={() => {
                          if (config?.imgList[0].link) {
                            window.location.href = config?.imgList[0].link
                          }
                        }}
                        alt=''
                      /> :
                      <div
                        style={{
                          height: imgHeight,
                          width: imgWidth,
                          background: '#ccc',
                        }}
                      />
                  }
                </div>
          }
        </div>
      }

      {type === 'App' && <div style={{
        display: 'flex', gap: 20,
        justifyContent: 'flex-start',
        width: 1060,
        flexWrap: 'wrap',
        margin: 'auto'
      }}>{config?.productList?.map(c => (
        <div
          style={{
            width: 250,
            borderRadius: '1px',
            fontSize: '10px',
            background: 'linear-gradient(180deg,#eff5ff, #f9fbff)',
            padding: 16
          }}
        >
          <div
            className="img-item-box"
          >
            {
              c?.icon ?
                <img
                  style={{
                    height: 48,
                    width: 48,
                    objectFit: "cover",
                    borderRadius: '8px'
                  }}
                  src={c?.icon?.path || c?.icon}
                  alt=''
                /> :
                <div
                  style={{
                    height: 48,
                    width: 48,
                    background: '#fff',
                    padding: '5px 0',
                    textAlign: 'center'
                  }}
                >
                  LOGO
                </div>
            }
          </div>
          <div style={{ background: '#e6ebf2', color: '#1e232a', marginTop: 5, padding: 4 }}>{c?.product?.name ? c?.product?.name : '应用标题'}</div>
          <div style={{
            background: '#e6ebf2', marginTop: 5,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            height: 38,
            padding: 4
          }}>适合企业：{c?.desc ? c?.desc : '内容'}</div>
          <div style={{ background: '#e6ebf2', marginTop: 5, padding: 4 }}>产品规格：{c?.specName ? c?.specName : '内容'}</div>
          <div style={{ background: '#e6ebf2', marginTop: 5, padding: 4 }}>使用期限：{c?.time ? c?.time : '内容'}</div>
          <div style={{ background: '#e6ebf2', marginTop: 5, padding: 4 }}>数量：{c?.num}</div>

          <div style={{ padding: '4px 0', background: 'linear-gradient(135deg,#0068ff, #2cabe8)', borderRadius: 1, marginTop: 10, color: '#fff', textAlign: 'center' }}>免费领取</div>
        </div>
      ))}
      </div>
      }
    </div>
  )

}

export default ComponentItem
