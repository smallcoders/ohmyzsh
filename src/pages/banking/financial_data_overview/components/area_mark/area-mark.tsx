import './area-mark.less'
import scopedClasses from '@/utils/scopedClasses'

const sc = scopedClasses('data-screen-area-mark')

export default (props: {
  title: string
  pos: {
    x: number
    y: number
  }
}) => {
  const { title, pos } = props || {}
  return (
    <div className={sc()} style={{ left: `${pos.x || 0}px`, top: `${pos.y || 0}px` }}>
      <div className={sc('bottom-circles')}>
        <div className={sc('bottom-circles-outside')} />
        <div className={sc('bottom-circles-middle')} />
        <div className={sc('bottom-circles-inside')} />
      </div>
      <div className={sc('top-mark')}>
        <span className={sc('top-mark-content')}>{title}</span>
      </div>
    </div>
  )
}
