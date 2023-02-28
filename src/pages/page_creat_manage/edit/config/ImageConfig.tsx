import { Button, Form, Input, InputNumber, message, Switch, Tooltip } from 'antd';
import { useConfig } from '../hooks/hooks'
import dragIcon from '@/assets/page_creat_manage/drag-item.png';
import UploadForm from '../components/upload_form/upload-form';
import questionIcon from '@/assets/page_creat_manage/question_icon.png';
import { clone } from 'lodash-es';
import Sortable from 'sortablejs';

const ImageConfig = () => {
  const { selectWidgetItem, handleChange } = useConfig()
  const { config } = selectWidgetItem || {}

  const sortableGroupDecorator = (instance: HTMLUListElement | null) => {
    if (instance) {
      const options: Sortable.Options = {
        ghostClass: 'ghost',
        handle: '.drag-item',
        group: {
          name: 'options'
        },
        onEnd: (event) => {
          const { newIndex, oldIndex } = event
          const configImgList: [] = clone(selectWidgetItem!.config!.imgList)
          const oldImgList = configImgList.splice(oldIndex!, 1)
          configImgList.splice(newIndex!, 0, ...oldImgList)
          handleChange(clone(configImgList), 'config.imgList')
        }
      }
      Sortable.create(instance, options)
    }
  }

  const getImageList = (newImgListLength: number, imgStyle: string) => {
    const currentImgListLength = config?.imgList.length
    if (imgStyle === 'matrix'){
      if (newImgListLength > currentImgListLength){
        const difLength = newImgListLength - currentImgListLength
        const indexList: number[] = selectWidgetItem!.config!.imgList.map((item: {label: string, value: string, index: number}) => {
          return item.index
        })
        const max = Math.max(...indexList)
        const difArr = []
        for (let i = 0; i < difLength; i++){
          difArr.push({
            img: '',
            link: '',
            index: max + i + 1
          })
        }
        console.log(newImgListLength, currentImgListLength, config?.imgList, difArr, 'config?.imgList.concat(difArr),')
        handleChange(config?.imgList.concat(difArr), 'config.imgList')
      }
      if (newImgListLength < currentImgListLength){
        handleChange(config?.imgList.slice(0, newImgListLength), 'config.imgList')
      }
    } else {
      handleChange([config?.imgList[0]], 'config.imgList')
    }
  }

  return (
    <>
      <Form.Item label="图片样式">
        <div className="img-style">
          <div
            className={config?.imgStyle === 'banner' ? 'img-style-item active' : 'img-style-item'}
            onClick={() => {
              handleChange('banner', 'config.imgStyle')
              handleChange(1920, 'config.imgWidth')
              handleChange(360, 'config.imgHeight')
              getImageList(1, 'banner')
            }}
          >
            banner
          </div>
          <div
            className={config?.imgStyle === 'main' ? 'img-style-item active' : 'img-style-item'}
            onClick={() => {
              handleChange('main', 'config.imgStyle')
              handleChange(1200, 'config.imgWidth')
              handleChange(300, 'config.imgHeight')
              getImageList(1, 'main')
            }}
          >
            文本
          </div>
          <div
            className={config?.imgStyle === 'matrix' ? 'img-style-item active' : 'img-style-item'}
            onClick={() => {
              handleChange('matrix', 'config.imgStyle')
              handleChange(282, 'config.imgWidth')
              handleChange(188, 'config.imgHeight')
              handleChange(4, 'config.columnNumber')
              handleChange(2, 'config.lineNumber')
              getImageList(8, 'matrix')
            }}
          >
            矩阵图片
          </div>
        </div>
      </Form.Item>
      <Form.Item label="排版">
        {
          config?.imgStyle === 'matrix' &&
          <div className="config-item center">
            <div className="config-item-label">矩阵数量:</div>
            <div className="flex special-style matrix">
              <InputNumber
                value={config?.columnNumber}
                max={5}
                min={3}
                onChange={(value) => {
                  if (value){
                    handleChange(value, 'config.columnNumber')
                    getImageList(value * config.lineNumber, 'matrix')
                    if (value === 3){
                      handleChange(384, 'config.imgWidth')
                      handleChange(256, 'config.imgHeight')
                    }
                    if (value === 4){
                      handleChange(282, 'config.imgWidth')
                      handleChange(188, 'config.imgHeight')
                    }
                    if (value === 5){
                      handleChange(224, 'config.imgWidth')
                      handleChange(149, 'config.imgHeight')
                    }
                  }
                }}
              />
              <span className="multi-icon">*</span>
              <InputNumber
                value={config?.lineNumber}
                max={8}
                min={1}
                onChange={(value) => {
                  if (value){
                    handleChange(value, 'config.lineNumber')
                    getImageList(value * config.columnNumber, 'matrix')
                  }
                }}
              />
            </div>
          </div>
        }
        <div className="config-item center">
          <div className="config-item-label">{config?.imgStyle === 'matrix' ? '单图尺寸:' : '尺寸设置:'}</div>
          <div className="flex special-style">
            <InputNumber
              value={config?.imgWidth}
              max={config?.imgStyle === 'banner' ? 1920 : 1200}
              min={1}
              onChange={(value) => {
                handleChange(value, 'config.imgWidth')
              }}
              controls
              addonAfter={<span>W</span>}
              disabled={config?.imgStyle === 'matrix'}
            />
            <span className="multi-icon">*</span>
            <InputNumber
              value={config?.imgHeight}
              max={9999}
              min={1}
              controls
              addonAfter={<span>H</span>}
              onChange={(value) => {
                handleChange(value, 'config.imgHeight')
              }}
            />
          </div>
        </div>
        {
          config?.imgStyle !== 'matrix' &&
          <div className="config-item center">
            <div className="config-item-label">多图轮播:</div>
            <div className="flex special-style">
              <Switch checked={config?.isCarousel} onChange={(checked) => {
                handleChange(checked, 'config.isCarousel')
              }} />
            </div>
          </div>
        }
      </Form.Item>
      <div>
        <div>
          图片上传
          <Tooltip title="点击图片缩略图区域可上传图片,缩略图后方输入框可设置图片跳转链接">
            <img className="question-icon" src={questionIcon} alt='' />
          </Tooltip>
        </div>
        <ul ref={sortableGroupDecorator}>
          {selectWidgetItem?.config?.imgList?.map((option: { img: string, link: string, index: number }, id: number) => (
            <li key={`${option.index}`}>
              <div className="option-item">
                <img className="drag-item" src={dragIcon} alt='' />
                <UploadForm
                  listType="picture-card"
                  className="avatar-uploader"
                  maxSize={10}
                  action={'/antelope-common/common/file/upload/record'}
                  showUploadList={false}
                  style={{width: '36px', height: '36px', marginBottom: 0}}
                  accept=".bmp,.gif,.png,.jpeg,.jpg"
                  value={option.img}
                  onChange={(value: any) => {
                    const newConfigImgList = clone(selectWidgetItem!.config!.imgList)
                    newConfigImgList[id].img = value?.path || value || ''
                    handleChange(newConfigImgList, 'config.imgList')
                  }}
                  noUploadText={true}
                />
                <div>
                  <Tooltip
                    title={option.link}
                  >
                    <Input
                      value={option.link}
                      maxLength={50}
                      className="ellipsis"
                      placeholder="https://"
                      onChange={(event) => {
                        const newConfigImgList = clone(selectWidgetItem!.config!.imgList)
                        newConfigImgList[id].link = event.target.value
                        handleChange(newConfigImgList, 'config.imgList')
                      }}
                    />
                  </Tooltip>
                </div>
                {
                  config?.imgStyle !== 'matrix' &&
                  <Button
                    type="ghost"
                    shape="circle"
                    size="small"
                    onClick={() => {
                      if (selectWidgetItem?.config?.imgList.length <= 1){
                        message.warn('请至少保留1个选项', 2)
                        return
                      }
                      const newConfigImgList = clone(selectWidgetItem!.config!.imgList)
                      newConfigImgList.splice(id, 1)
                      handleChange(newConfigImgList, 'config.imgList')
                    }}
                  >
                    —
                  </Button>
                }
              </div>
            </li>
          ))}
        </ul>
        {
          config?.imgStyle !== 'matrix' && config?.isCarousel &&
          <Button
            className="insert-btn"
            type="link"
            size="small"
            onClick={() => {
              const newConfigImgList = clone(selectWidgetItem!.config!.imgList)
              const indexList: number[] = newConfigImgList.map((item: {label: string, value: string, index: number}) => {
                return item.index
              })
              const max = Math.max(...indexList)
              newConfigImgList.push({ img: '', link: '', index: max + 1 })
              handleChange(newConfigImgList, 'config.imgList')
            }}
          >
            添加图片
          </Button>
        }
      </div>
      {
        config?.isCarousel &&
        <div className="config-item center">
          <div className="config-item-label">轮播间隔:</div>
          <div className="flex">
            <InputNumber
              value={config?.duration}
              max={99}
              min={1}
              onChange={(value) => handleChange(value, 'config.duration')}
              addonAfter={<span>s</span>}
            />
          </div>
        </div>
      }
    </>
  )
}

export default ImageConfig
