import moment from 'moment';
import './common-title.less';

type Props = {
  title: string;
  detail?: string;
  time?: string;
  special?: boolean;
  reason?: string;
  color?: string;
};

export default ({
  title,
  detail = '',
  time = '',
  special = false,
  reason = '',
  color = 'rgba(0, 0, 0, 0.65)',
}: Props) => {
  return (
    <div className="common-title-container">
      <div className="common-title-content">
        <span className="common-title-title">{title || '平台审核'}</span>
        <span className="common-title-detail" style={{ color: color }}>
          {detail}
        </span>
        <span className="common-title-time">
          {time ? moment(time).format('YYYY-MM-DD HH:mm:ss') : ''}
        </span>
      </div>
      {special ? (
        <div className="common-title-reason" style={{ color: color }}>
          <span className="common-title-reason-placeholder" />
          <span className="common-title-reason-detail">{reason}</span>
        </div>
      ) : null}
    </div>
  );
};
